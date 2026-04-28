// ============================================================
// SELLTRU DAILY SEO HEARTBEAT REPORT
// Google Apps Script — sends to andrewderamo18@gmail.com
// Setup instructions at the bottom of this file
// ============================================================

const CONFIG = {
  EMAIL_TO:        'andrewderamo18@gmail.com',
  SITE_URL:        'https://www.selltru.com/',   // Must match exactly in Search Console
  GA4_PROPERTY_ID: 'REPLACE_WITH_YOUR_GA4_PROPERTY_ID', // e.g. '123456789'
  DAYS_LOOKBACK:   7,
  BRAND_DARK:      '#0d1b2e',
  BRAND_ORANGE:    '#E85D26',
};

// ============================================================
// MAIN — called by the daily trigger
// ============================================================
function sendDailySEOReport() {
  try {
    const today     = new Date();
    const end       = offsetDate(today, -1);
    const start     = offsetDate(today, -CONFIG.DAYS_LOOKBACK);
    const prevEnd   = offsetDate(today, -(CONFIG.DAYS_LOOKBACK + 1));
    const prevStart = offsetDate(today, -(CONFIG.DAYS_LOOKBACK * 2));

    const gsc = fetchGSC(start, end, prevStart, prevEnd);
    const ga  = fetchGA4(start, end, prevStart, prevEnd);

    const subject  = `📊 SellTru SEO Heartbeat — ${displayDate(today)}`;
    const htmlBody = buildEmail(gsc, ga, start, end);

    GmailApp.sendEmail(CONFIG.EMAIL_TO, subject, 'Please view in HTML.', { htmlBody });
    Logger.log('✅ Report sent to ' + CONFIG.EMAIL_TO);
  } catch (err) {
    Logger.log('❌ Error: ' + err);
    GmailApp.sendEmail(CONFIG.EMAIL_TO, '⚠️ SellTru SEO Report Error', err.toString());
  }
}

// ============================================================
// GOOGLE SEARCH CONSOLE
// ============================================================
function fetchGSC(start, end, prevStart, prevEnd) {
  function query(startDate, endDate, extra) {
    return SearchConsole.Searchanalytics.query(CONFIG.SITE_URL,
      Object.assign({ startDate, endDate, rowLimit: 25 }, extra));
  }

  try {
    const curr = query(start, end, { dimensions: [] });
    const prev = query(prevStart, prevEnd, { dimensions: [] });

    const topQueries = query(start, end, {
      dimensions: ['query'],
      orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }]
    });

    const blogPages = query(start, end, {
      dimensions: ['page'],
      dimensionFilterGroups: [{
        filters: [{ dimension: 'page', operator: 'contains', expression: '/blog/' }]
      }],
      orderBy: [{ fieldName: 'impressions', sortOrder: 'DESCENDING' }]
    });

    const nearMiss = query(start, end, {
      dimensions: ['query'],
      dimensionFilterGroups: [{
        filters: [
          { dimension: 'position', operator: 'greaterThan',     expression: '10' },
          { dimension: 'position', operator: 'lessThanOrEqual', expression: '20' }
        ]
      }],
      orderBy: [{ fieldName: 'impressions', sortOrder: 'DESCENDING' }]
    });

    return {
      curr:       (curr.rows || [{ clicks:0, impressions:0, ctr:0, position:0 }])[0],
      prev:       (prev.rows || [{ clicks:0, impressions:0, ctr:0, position:0 }])[0],
      topQueries: topQueries.rows || [],
      blogPages:  blogPages.rows  || [],
      nearMiss:   nearMiss.rows   || [],
    };
  } catch (e) {
    Logger.log('GSC error: ' + e);
    return { curr:{}, prev:{}, topQueries:[], blogPages:[], nearMiss:[], error: e.toString() };
  }
}

// ============================================================
// GOOGLE ANALYTICS 4
// ============================================================
function fetchGA4(start, end, prevStart, prevEnd) {
  const prop = 'properties/' + CONFIG.GA4_PROPERTY_ID;

  function runReport(dateStart, dateEnd, extra) {
    return AnalyticsData.Properties.runReport(prop,
      Object.assign({
        dateRanges: [{ startDate: dateStart, endDate: dateEnd }],
        metrics: [
          { name: 'sessions' },
          { name: 'newUsers' },
          { name: 'engagementRate' },
          { name: 'averageSessionDuration' },
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'sessionDefaultChannelGroup',
            stringFilter: { matchType: 'EXACT', value: 'Organic Search' }
          }
        }
      }, extra));
  }

  try {
    const curr = runReport(start, end, {});
    const prev = runReport(prevStart, prevEnd, {});

    const blogReport = AnalyticsData.Properties.runReport(prop, {
      dateRanges: [{ startDate: start, endDate: end }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }, { name: 'engagementRate' }],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: { matchType: 'BEGINS_WITH', value: '/blog/' }
        }
      },
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10
    });

    const cv = curr.rows?.[0]?.metricValues || [];
    const pv = prev.rows?.[0]?.metricValues || [];

    return {
      sessions:        parseInt(cv[0]?.value || 0),
      newUsers:        parseInt(cv[1]?.value || 0),
      engagementRate:  parseFloat(cv[2]?.value || 0),
      avgDuration:     parseFloat(cv[3]?.value || 0),
      prevSessions:    parseInt(pv[0]?.value || 0),
      prevNewUsers:    parseInt(pv[1]?.value || 0),
      blogRows:        blogReport.rows || [],
    };
  } catch (e) {
    Logger.log('GA4 error: ' + e);
    return { sessions:0, newUsers:0, engagementRate:0, avgDuration:0, prevSessions:0, prevNewUsers:0, blogRows:[], error: e.toString() };
  }
}

// ============================================================
// EMAIL HTML BUILDER
// ============================================================
function buildEmail(gsc, ga, start, end) {
  const c   = gsc.curr || {};
  const p   = gsc.prev || {};

  const clicks      = c.clicks      || 0;
  const impr        = c.impressions  || 0;
  const ctr         = ((c.ctr       || 0) * 100).toFixed(1);
  const pos         = (c.position   || 0).toFixed(1);
  const pClicks     = p.clicks      || 0;
  const pImpr       = p.impressions  || 0;
  const pPos        = p.position    || 0;

  // ---- helpers ----
  function pctDelta(curr, prev, invertColor) {
    if (!prev) return badge('—', '#94a3b8');
    const pct = Math.round(((curr - prev) / prev) * 100);
    const good = invertColor ? pct < 0 : pct >= 0;
    return badge((pct >= 0 ? '↑ ' : '↓ ') + Math.abs(pct) + '%', good ? '#10b981' : '#ef4444');
  }
  function posDelta(curr, prev) {
    if (!prev) return badge('—', '#94a3b8');
    const diff = parseFloat(curr) - parseFloat(prev);
    const good = diff <= 0;
    return badge((good ? '↑ ' : '↓ ') + Math.abs(diff).toFixed(1) + ' pos', good ? '#10b981' : '#ef4444');
  }
  function badge(text, color) {
    return `<span style="font-size:11px;font-weight:700;color:${color}">${text}</span>`;
  }
  function stat(value, label, delta) {
    return `
      <td style="width:25%;padding:0 6px">
        <div style="background:#f8fafc;border-radius:10px;padding:16px;text-align:center">
          <div style="font-size:26px;font-weight:900;color:#0f172a;letter-spacing:-1px">${value}</div>
          <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;margin:4px 0">${label}</div>
          ${delta}
        </div>
      </td>`;
  }
  function sectionHead(icon, title, subtitle) {
    return `
      <div style="padding:20px 24px 0">
        <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8">${icon} ${title}</div>
        ${subtitle ? `<div style="font-size:12px;color:#cbd5e1;margin-top:3px">${subtitle}</div>` : ''}
      </div>`;
  }
  function tableHead(cols) {
    return `<tr style="background:#f1f5f9">${cols.map(c =>
      `<th style="padding:8px 12px;text-align:${c.right?'right':'left'};font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#94a3b8;font-weight:700">${c.label}</th>`
    ).join('')}</tr>`;
  }
  function cleanPath(url) {
    return (url || '').replace(/https?:\/\/(www\.)?selltru\.com/, '') || '/';
  }
  function dur(s) {
    return Math.floor(s/60) + 'm ' + Math.round(s%60) + 's';
  }
  function posColor(pos) {
    if (pos <= 3)  return '#10b981';
    if (pos <= 10) return '#3b82f6';
    if (pos <= 20) return '#f59e0b';
    return '#ef4444';
  }

  // ---- query rows ----
  const queryRows = gsc.topQueries.slice(0, 10).map((r, i) => `
    <tr style="border-bottom:1px solid #f1f5f9">
      <td style="padding:8px 12px;font-size:12px;color:#94a3b8">${i+1}</td>
      <td style="padding:8px 12px;font-size:13px;color:#1e293b">${r.keys[0]}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:600;color:#1e293b">${r.clicks}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;color:#64748b">${r.impressions.toLocaleString()}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;color:#64748b">${(r.ctr*100).toFixed(1)}%</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:700;color:${posColor(r.position)}">${r.position.toFixed(1)}</td>
    </tr>`).join('') || `<tr><td colspan="6" style="padding:20px;text-align:center;color:#94a3b8;font-size:13px">No queries yet — GSC data appears after ~3–5 days of indexing</td></tr>`;

  // ---- blog rows (GSC) ----
  const blogGSCRows = gsc.blogPages.slice(0, 8).map(r => `
    <tr style="border-bottom:1px solid #f1f5f9">
      <td style="padding:8px 12px;font-size:12px;color:#1e293b;word-break:break-all">${cleanPath(r.keys[0])}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:600;color:#1e293b">${r.clicks}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;color:#64748b">${r.impressions.toLocaleString()}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:700;color:${posColor(r.position)}">${r.position.toFixed(1)}</td>
    </tr>`).join('') || `<tr><td colspan="4" style="padding:20px;text-align:center;color:#94a3b8;font-size:13px">Blog posts not yet indexed — typically takes 1–4 weeks for new content</td></tr>`;

  // ---- blog rows (GA4) ----
  const blogGA4Rows = ga.blogRows.slice(0, 8).map(r => {
    const mv = r.metricValues || [];
    return `
    <tr style="border-bottom:1px solid #f1f5f9">
      <td style="padding:8px 12px;font-size:12px;color:#1e293b;word-break:break-all">${r.dimensionValues[0]?.value || '—'}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:600;color:#1e293b">${mv[0]?.value || 0}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;color:#64748b">${mv[1]?.value || 0}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;color:#64748b">${Math.round((parseFloat(mv[2]?.value)||0)*100)}%</td>
    </tr>`}).join('') || `<tr><td colspan="4" style="padding:20px;text-align:center;color:#94a3b8;font-size:13px">No organic sessions to blog posts yet</td></tr>`;

  // ---- near-miss rows ----
  const nearMissRows = gsc.nearMiss.slice(0, 8).map(r => `
    <tr style="border-bottom:1px solid #fde68a">
      <td style="padding:8px 12px;font-size:13px;color:#1e293b">${r.keys[0]}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:700;color:#d97706">${r.position.toFixed(1)}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;color:#92400e">${r.impressions.toLocaleString()}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;color:#92400e">${r.clicks}</td>
    </tr>`).join('') || `<tr><td colspan="4" style="padding:16px;text-align:center;color:#b45309;font-size:13px">Near-miss keywords will appear here once content starts ranking</td></tr>`;

  const period = `${displayDate(new Date(start+'T12:00:00'))} – ${displayDate(new Date(end+'T12:00:00'))}`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:680px;margin:0 auto;padding:24px 16px">

  <!-- HEADER -->
  <div style="background:linear-gradient(135deg,${CONFIG.BRAND_DARK} 0%,#1a3050 100%);border-radius:14px 14px 0 0;padding:36px 32px;text-align:center">
    <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:10px">SELLTRU.COM</div>
    <div style="font-size:30px;font-weight:900;color:#fff;letter-spacing:-0.5px;margin-bottom:6px">📊 SEO Heartbeat</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.6)">${displayDate(new Date())}</div>
    <div style="display:inline-block;background:rgba(255,255,255,0.08);border-radius:20px;padding:5px 14px;margin-top:10px">
      <span style="font-size:11px;color:rgba(255,255,255,0.45)">Period: ${period}</span>
    </div>
  </div>

  <!-- GSC STATS -->
  <div style="background:#fff;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;padding:24px">
    ${sectionHead('🔍', 'Google Search Console', 'How selltru.com appears in Google search results')}
    <table style="width:100%;border-collapse:collapse;margin-top:16px"><tr>
      ${stat(clicks.toLocaleString(), 'Clicks', pctDelta(clicks, pClicks))}
      ${stat(impr.toLocaleString(), 'Impressions', pctDelta(impr, pImpr))}
      ${stat(ctr + '%', 'CTR', badge('avg click rate', '#94a3b8'))}
      ${stat(pos, 'Avg Position', posDelta(pos, pPos))}
    </tr></table>
    <div style="margin-top:12px;font-size:11px;color:#cbd5e1;text-align:center">↑ green = improvement vs previous ${CONFIG.DAYS_LOOKBACK} days &nbsp;•&nbsp; For position, lower number = better ranking</div>
  </div>

  <!-- GA4 STATS -->
  <div style="background:#fff;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;border-top:2px solid #f1f5f9;padding:8px 24px 24px">
    ${sectionHead('📈', 'GA4 Organic Traffic', 'Sessions arriving from Google search only')}
    <table style="width:100%;border-collapse:collapse;margin-top:16px"><tr>
      ${stat(ga.sessions.toLocaleString(), 'Sessions', pctDelta(ga.sessions, ga.prevSessions))}
      ${stat(ga.newUsers.toLocaleString(), 'New Users', pctDelta(ga.newUsers, ga.prevNewUsers))}
      ${stat(Math.round(ga.engagementRate * 100) + '%', 'Engaged', badge('engaged sessions', '#94a3b8'))}
      ${stat(dur(ga.avgDuration), 'Avg. Time', badge('on site', '#94a3b8'))}
    </tr></table>
  </div>

  <!-- TOP QUERIES -->
  <div style="background:#fff;border:1px solid #e2e8f0;border-top:2px solid #f1f5f9;padding:24px;margin-top:0">
    ${sectionHead('🎯', 'Top Search Queries', 'What people are Googling to find SellTru')}
    <table style="width:100%;border-collapse:collapse;margin-top:16px">
      ${tableHead([{label:'#'},{label:'Query'},{label:'Clicks',right:true},{label:'Impressions',right:true},{label:'CTR',right:true},{label:'Position',right:true}])}
      ${queryRows}
    </table>
  </div>

  <!-- BLOG PERFORMANCE (GSC) -->
  <div style="background:#fff;border:1px solid #e2e8f0;border-top:2px solid #f1f5f9;padding:24px">
    ${sectionHead('✍️', 'Blog Post Rankings (Search Console)', 'Impressions & clicks driven by your /blog/ content')}
    <table style="width:100%;border-collapse:collapse;margin-top:16px">
      ${tableHead([{label:'Blog Post'},{label:'Clicks',right:true},{label:'Impressions',right:true},{label:'Avg. Position',right:true}])}
      ${blogGSCRows}
    </table>
  </div>

  <!-- BLOG TRAFFIC (GA4) -->
  <div style="background:#fff;border:1px solid #e2e8f0;border-top:2px solid #f1f5f9;padding:24px">
    ${sectionHead('🚦', 'Blog Post Traffic (GA4)', 'Actual organic sessions landing on your blog posts')}
    <table style="width:100%;border-collapse:collapse;margin-top:16px">
      ${tableHead([{label:'Blog Post'},{label:'Sessions',right:true},{label:'Pageviews',right:true},{label:'Engaged',right:true}])}
      ${blogGA4Rows}
    </table>
  </div>

  <!-- NEAR-MISS KEYWORDS -->
  <div style="background:#fffbeb;border:1px solid #fde68a;border-top:2px solid #fef3c7;padding:24px">
    ${sectionHead('🚀', 'Low-Hanging Fruit — Positions 11–20', 'These keywords are almost on page 1. One good update could push them over.')}
    <table style="width:100%;border-collapse:collapse;margin-top:16px">
      ${tableHead([{label:'Keyword'},{label:'Position',right:true},{label:'Impressions',right:true},{label:'Clicks',right:true}])}
      ${nearMissRows}
    </table>
    <div style="margin-top:12px;padding:12px;background:#fef3c7;border-radius:8px;font-size:12px;color:#92400e">
      💡 <strong>What to do:</strong> For each keyword in positions 11–20, find the page targeting that keyword, add more depth to the content, improve the title tag, and build 1–2 internal links to it.
    </div>
  </div>

  <!-- FOOTER -->
  <div style="background:${CONFIG.BRAND_DARK};border-radius:0 0 14px 14px;padding:20px 24px;text-align:center">
    <div style="font-size:12px;color:rgba(255,255,255,0.35)">SellTru SEO Heartbeat • Delivered every morning at 8 AM</div>
    <div style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:4px">Google Search Console + GA4 • selltru.com</div>
  </div>

</div>
</body></html>`;
}

// ============================================================
// HELPERS
// ============================================================
function offsetDate(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
function displayDate(date) {
  return date.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' });
}

// ============================================================
// SETUP — Run this ONE TIME to install the daily 8 AM trigger
// ============================================================
function setupDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('sendDailySEOReport')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();
  Logger.log('✅ Daily trigger created — report will arrive at ' + CONFIG.EMAIL_TO + ' every morning at 8 AM.');
}

// ============================================================
// TEST — Run this to send a test report right now
// ============================================================
function testReport() {
  Logger.log('Sending test report...');
  sendDailySEOReport();
  Logger.log('Done! Check ' + CONFIG.EMAIL_TO);
}

// ============================================================
// SETUP INSTRUCTIONS
// ============================================================
//
// STEP 1 — Get your GA4 Property ID
//   → Go to analytics.google.com
//   → Admin → Property Settings
//   → Copy the "Property ID" (a number like 123456789)
//   → Paste it into CONFIG.GA4_PROPERTY_ID above
//
// STEP 2 — Create the Apps Script project
//   → Go to script.google.com → New Project
//   → Name it "SellTru SEO Report"
//   → Delete the default code and paste this entire file
//
// STEP 3 — Enable the required services
//   → Left sidebar → click "+" next to Services
//   → Add "Google Search Console API"
//   → Add "Google Analytics Data API"
//   → Click Save
//
// STEP 4 — Run the setup trigger (one time only)
//   → In the function dropdown (top toolbar), select "setupDailyTrigger"
//   → Click ▶ Run
//   → Click "Review Permissions" → Allow
//   → This installs the 8 AM daily schedule
//
// STEP 5 — Send a test report right now
//   → In the function dropdown, select "testReport"
//   → Click ▶ Run
//   → Check andrewderamo18@gmail.com — report should arrive within ~30 seconds
//
// IMPORTANT — Your Google account must have:
//   • Google Analytics 4 property set up for selltru.com
//   • Search Console property verified for https://www.selltru.com/
//   • The same Google account used to run this script needs access to both
//
// ============================================================
