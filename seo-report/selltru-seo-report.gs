// ============================================================
// SELLTRU DAILY SEO HEARTBEAT REPORT
// Google Apps Script — sends to andrewderamo18@gmail.com
// ============================================================

const CONFIG = {
  EMAIL_TO:        'andrewderamo18@gmail.com',
  SITE_URL:        'https://www.selltru.com/',
  GA4_PROPERTY_ID: '471676900',
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

    const subject  = `[SEO Report] SellTru Heartbeat — ${displayDate(today)}`;
    const htmlBody = buildEmail(gsc, ga, start, end);

    GmailApp.sendEmail(CONFIG.EMAIL_TO, subject, 'Please view in HTML.', { htmlBody });
    Logger.log('✅ Report sent to ' + CONFIG.EMAIL_TO);
  } catch (err) {
    Logger.log('❌ Error: ' + err);
    GmailApp.sendEmail(CONFIG.EMAIL_TO, '⚠️ SellTru SEO Report Error', err.toString());
  }
}

// ============================================================
// GOOGLE SEARCH CONSOLE (REST API via UrlFetchApp)
// ============================================================
function fetchGSC(start, end, prevStart, prevEnd) {
  const token       = ScriptApp.getOAuthToken();
  const encodedSite = encodeURIComponent(CONFIG.SITE_URL);
  const apiUrl      = 'https://searchconsole.googleapis.com/webmasters/v3/sites/' +
                      encodedSite + '/searchAnalytics/query';

  function query(startDate, endDate, extra) {
    const body     = Object.assign({ startDate, endDate, rowLimit: 25 }, extra);
    const response = UrlFetchApp.fetch(apiUrl, {
      method:             'post',
      contentType:        'application/json',
      headers:            { Authorization: 'Bearer ' + token },
      payload:            JSON.stringify(body),
      muteHttpExceptions: true,
    });
    const code = response.getResponseCode();
    const text = response.getContentText();
    if (code !== 200) throw new Error('GSC API ' + code + ': ' + text);
    return JSON.parse(text);
  }

  try {
    const curr       = query(start, end, { dimensions: [] });
    const prev       = query(prevStart, prevEnd, { dimensions: [] });
    const topQueries = query(start, end, {
      dimensions: ['query'],
      orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }],
    });
    const blogPages  = query(start, end, {
      dimensions: ['page'],
      dimensionFilterGroups: [{ filters: [{ dimension: 'PAGE', operator: 'CONTAINS', expression: '/blog/' }] }],
      orderBy: [{ fieldName: 'impressions', sortOrder: 'DESCENDING' }],
    });
    // Fetch top 50 queries and filter client-side for positions 10-20 (near misses)
    // GSC does not support server-side filtering by position
    const allQueries = query(start, end, {
      dimensions: ['query'],
      rowLimit: 50,
      orderBy: [{ fieldName: 'impressions', sortOrder: 'DESCENDING' }],
    });
    const nearMiss = { rows: (allQueries.rows || []).filter(r => r.position > 10 && r.position <= 20) };

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
// GOOGLE ANALYTICS 4 (direct REST via UrlFetchApp — no advanced service)
// ============================================================
function fetchGA4(start, end, prevStart, prevEnd) {
  const token   = ScriptApp.getOAuthToken();
  const baseUrl = 'https://analyticsdata.googleapis.com/v1beta/properties/' +
                  CONFIG.GA4_PROPERTY_ID + ':runReport';

  function ga4Post(body) {
    const response = UrlFetchApp.fetch(baseUrl, {
      method:             'post',
      contentType:        'application/json',
      headers:            { Authorization: 'Bearer ' + token },
      payload:            JSON.stringify(body),
      muteHttpExceptions: true,
    });
    const code = response.getResponseCode();
    const text = response.getContentText();
    if (code !== 200) throw new Error('GA4 API ' + code + ': ' + text);
    return JSON.parse(text);
  }

  const organicFilter = {
    filter: {
      fieldName: 'sessionDefaultChannelGroup',
      stringFilter: { matchType: 'EXACT', value: 'Organic Search' }
    }
  };

  try {
    const curr = ga4Post({
      dateRanges: [{ startDate: start, endDate: end }],
      metrics: [
        { name: 'sessions' },
        { name: 'newUsers' },
        { name: 'engagementRate' },
        { name: 'averageSessionDuration' },
      ],
      dimensionFilter: organicFilter,
    });
    const prev = ga4Post({
      dateRanges: [{ startDate: prevStart, endDate: prevEnd }],
      metrics: [
        { name: 'sessions' },
        { name: 'newUsers' },
        { name: 'engagementRate' },
        { name: 'averageSessionDuration' },
      ],
      dimensionFilter: organicFilter,
    });
    const blogReport = ga4Post({
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
      limit: 10,
    });

    const cv = (curr.rows || [])[0]?.metricValues || [];
    const pv = (prev.rows || [])[0]?.metricValues || [];

    return {
      sessions:       parseInt(cv[0]?.value  || 0),
      newUsers:       parseInt(cv[1]?.value  || 0),
      engagementRate: parseFloat(cv[2]?.value || 0),
      avgDuration:    parseFloat(cv[3]?.value || 0),
      prevSessions:   parseInt(pv[0]?.value  || 0),
      prevNewUsers:   parseInt(pv[1]?.value  || 0),
      blogRows:       blogReport.rows || [],
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
  const c = gsc.curr || {};
  const p = gsc.prev || {};

  const clicks  = c.clicks      || 0;
  const impr    = c.impressions  || 0;
  const ctr     = ((c.ctr       || 0) * 100).toFixed(1);
  const pos     = (c.position   || 0).toFixed(1);
  const pClicks = p.clicks      || 0;
  const pImpr   = p.impressions  || 0;
  const pPos    = p.position    || 0;

  function pctDelta(curr, prev) {
    if (!prev) return badge('—', '#94a3b8');
    const pct = Math.round(((curr - prev) / prev) * 100);
    return badge((pct >= 0 ? '↑ ' : '↓ ') + Math.abs(pct) + '%', pct >= 0 ? '#10b981' : '#ef4444');
  }
  function posDelta(curr, prev) {
    if (!prev) return badge('—', '#94a3b8');
    const diff = parseFloat(curr) - parseFloat(prev);
    return badge((diff <= 0 ? '↑ ' : '↓ ') + Math.abs(diff).toFixed(1) + ' pos', diff <= 0 ? '#10b981' : '#ef4444');
  }
  function badge(text, color) {
    return `<span style="font-size:11px;font-weight:700;color:${color}">${text}</span>`;
  }
  function stat(value, label, delta) {
    return `<td style="width:25%;padding:0 6px">
      <div style="background:#f8fafc;border-radius:10px;padding:16px;text-align:center">
        <div style="font-size:26px;font-weight:900;color:#0f172a;letter-spacing:-1px">${value}</div>
        <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;margin:4px 0">${label}</div>
        ${delta}
      </div></td>`;
  }
  function sectionHead(icon, title, subtitle) {
    return `<div style="padding:20px 24px 0">
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
  function posColor(p) {
    if (p <= 3)  return '#10b981';
    if (p <= 10) return '#3b82f6';
    if (p <= 20) return '#f59e0b';
    return '#ef4444';
  }

  const queryRows = gsc.topQueries.slice(0,10).map((r,i) => `
    <tr style="border-bottom:1px solid #f1f5f9">
      <td style="padding:8px 12px;font-size:12px;color:#94a3b8">${i+1}</td>
      <td style="padding:8px 12px;font-size:13px;color:#1e293b">${r.keys[0]}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:600;color:#1e293b">${r.clicks}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;color:#64748b">${r.impressions.toLocaleString()}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;color:#64748b">${(r.ctr*100).toFixed(1)}%</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:700;color:${posColor(r.position)}">${r.position.toFixed(1)}</td>
    </tr>`).join('') || `<tr><td colspan="6" style="padding:20px;text-align:center;color:#94a3b8;font-size:13px">No query data yet</td></tr>`;

  const blogGSCRows = gsc.blogPages.slice(0,8).map(r => `
    <tr style="border-bottom:1px solid #f1f5f9">
      <td style="padding:8px 12px;font-size:12px;color:#1e293b;word-break:break-all">${cleanPath(r.keys[0])}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:600;color:#1e293b">${r.clicks}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;color:#64748b">${r.impressions.toLocaleString()}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:700;color:${posColor(r.position)}">${r.position.toFixed(1)}</td>
    </tr>`).join('') || `<tr><td colspan="4" style="padding:20px;text-align:center;color:#94a3b8;font-size:13px">No blog impressions yet &mdash; Google typically takes 2&ndash;4 weeks to index new content</td></tr>`;

  const blogGA4Rows = ga.blogRows.slice(0,8).map(r => {
    const mv = r.metricValues || [];
    return `<tr style="border-bottom:1px solid #f1f5f9">
      <td style="padding:8px 12px;font-size:12px;color:#1e293b;word-break:break-all">${r.dimensionValues[0]?.value || '—'}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:600;color:#1e293b">${mv[0]?.value || 0}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;color:#64748b">${mv[1]?.value || 0}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;color:#64748b">${Math.round((parseFloat(mv[2]?.value)||0)*100)}%</td>
    </tr>`;}).join('') || `<tr><td colspan="4" style="padding:20px;text-align:center;color:#94a3b8;font-size:13px">No organic blog sessions yet &mdash; will populate once Google indexes your posts</td></tr>`;

  const nearMissRows = gsc.nearMiss.slice(0,8).map(r => `
    <tr style="border-bottom:1px solid #fde68a">
      <td style="padding:8px 12px;font-size:13px;color:#1e293b">${r.keys[0]}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:700;color:#d97706">${r.position.toFixed(1)}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;color:#92400e">${r.impressions.toLocaleString()}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;color:#92400e">${r.clicks}</td>
    </tr>`).join('') || `<tr><td colspan="4" style="padding:16px;text-align:center;color:#b45309;font-size:13px">Near-miss keywords will appear once content starts ranking</td></tr>`;

  const period = `${displayDate(new Date(start+'T12:00:00'))} – ${displayDate(new Date(end+'T12:00:00'))}`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:680px;margin:0 auto;padding:24px 16px">

  <div style="background:linear-gradient(135deg,${CONFIG.BRAND_DARK} 0%,#1a3050 100%);border-radius:14px 14px 0 0;padding:36px 32px;text-align:center">
    <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:10px">SELLTRU.COM</div>
    <div style="font-size:30px;font-weight:900;color:#fff;letter-spacing:-0.5px;margin-bottom:6px">&#128202; SEO Heartbeat</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.6)">${displayDate(new Date())}</div>
    <div style="display:inline-block;background:rgba(255,255,255,0.08);border-radius:20px;padding:5px 14px;margin-top:10px">
      <span style="font-size:11px;color:rgba(255,255,255,0.45)">Period: ${period}</span>
    </div>
  </div>

  <div style="background:#fff;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;padding:24px">
    ${sectionHead('&#128269;', 'Google Search Console', 'How selltru.com appears in Google search results')}
    <table style="width:100%;border-collapse:collapse;margin-top:16px"><tr>
      ${stat(clicks.toLocaleString(), 'Clicks', pctDelta(clicks, pClicks))}
      ${stat(impr.toLocaleString(), 'Impressions', pctDelta(impr, pImpr))}
      ${stat(ctr + '%', 'CTR', badge('avg click rate', '#94a3b8'))}
      ${stat(pos, 'Avg Position', posDelta(pos, pPos))}
    </tr></table>
    <div style="margin-top:12px;font-size:11px;color:#cbd5e1;text-align:center">vs previous ${CONFIG.DAYS_LOOKBACK} days &nbsp;•&nbsp; lower position number = better ranking</div>
  </div>

  <div style="background:#fff;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;border-top:2px solid #f1f5f9;padding:8px 24px 24px">
    ${sectionHead('&#128200;', 'GA4 Organic Traffic', 'Sessions arriving from Google search only')}
    <table style="width:100%;border-collapse:collapse;margin-top:16px"><tr>
      ${stat(ga.sessions.toLocaleString(), 'Sessions', pctDelta(ga.sessions, ga.prevSessions))}
      ${stat(ga.newUsers.toLocaleString(), 'New Users', pctDelta(ga.newUsers, ga.prevNewUsers))}
      ${stat(Math.round(ga.engagementRate * 100) + '%', 'Engaged', badge('engaged sessions', '#94a3b8'))}
      ${stat(dur(ga.avgDuration), 'Avg. Time', badge('on site', '#94a3b8'))}
    </tr></table>
  </div>

  <div style="background:#fff;border:1px solid #e2e8f0;border-top:2px solid #f1f5f9;padding:24px">
    ${sectionHead('&#127919;', 'Top Search Queries', 'What people are Googling to find SellTru')}
    <table style="width:100%;border-collapse:collapse;margin-top:16px">
      ${tableHead([{label:'#'},{label:'Query'},{label:'Clicks',right:true},{label:'Impressions',right:true},{label:'CTR',right:true},{label:'Position',right:true}])}
      ${queryRows}
    </table>
  </div>

  <div style="background:#fff;border:1px solid #e2e8f0;border-top:2px solid #f1f5f9;padding:24px">
    ${sectionHead('&#9997;', 'Blog Post Rankings (Search Console)', 'Impressions &amp; clicks from your /blog/ content')}
    <table style="width:100%;border-collapse:collapse;margin-top:16px">
      ${tableHead([{label:'Blog Post'},{label:'Clicks',right:true},{label:'Impressions',right:true},{label:'Avg. Position',right:true}])}
      ${blogGSCRows}
    </table>
  </div>

  <div style="background:#fff;border:1px solid #e2e8f0;border-top:2px solid #f1f5f9;padding:24px">
    ${sectionHead('&#128678;', 'Blog Post Traffic (GA4)', 'Organic sessions landing on your blog posts')}
    <table style="width:100%;border-collapse:collapse;margin-top:16px">
      ${tableHead([{label:'Blog Post'},{label:'Sessions',right:true},{label:'Pageviews',right:true},{label:'Engaged',right:true}])}
      ${blogGA4Rows}
    </table>
  </div>

  <div style="background:#fffbeb;border:1px solid #fde68a;padding:24px">
    ${sectionHead('&#128640;', 'Low-Hanging Fruit &mdash; Positions 11&ndash;20', 'Almost on page 1. One good update could push these over.')}
    <table style="width:100%;border-collapse:collapse;margin-top:16px">
      ${tableHead([{label:'Keyword'},{label:'Position',right:true},{label:'Impressions',right:true},{label:'Clicks',right:true}])}
      ${nearMissRows}
    </table>
    <div style="margin-top:12px;padding:12px;background:#fef3c7;border-radius:8px;font-size:12px;color:#92400e">
      &#128161; <strong>What to do:</strong> For each keyword here, find the page targeting it, add more depth, improve the title tag, and build 1&ndash;2 internal links to it.
    </div>
  </div>

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
// DAILY TRIGGER — run once to install
// ============================================================
function setupDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('sendDailySEOReport')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();
  Logger.log('✅ Daily trigger set — report will arrive at ' + CONFIG.EMAIL_TO + ' every morning at 8 AM.');
}

// ============================================================
// TEST — sends a report immediately
// ============================================================
function testReport() {
  sendDailySEOReport();
  Logger.log('Done — check ' + CONFIG.EMAIL_TO);
}

// ============================================================
// DEBUG — run this if data comes back as zeros
// Check View → Logs after running
// ============================================================
function debugReport() {
  Logger.log('=== SELLTRU SEO DEBUG ===');
  Logger.log('SITE_URL: ' + CONFIG.SITE_URL);
  Logger.log('GA4_PROPERTY_ID: ' + CONFIG.GA4_PROPERTY_ID);

  const token = ScriptApp.getOAuthToken();
  Logger.log('OAuth token: ' + (token ? 'YES (length ' + token.length + ')' : 'NO'));

  Logger.log('\n--- GSC: Your verified sites ---');
  try {
    const r = UrlFetchApp.fetch('https://searchconsole.googleapis.com/webmasters/v3/sites', {
      headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true
    });
    Logger.log('Response ' + r.getResponseCode() + ': ' + r.getContentText());
  } catch (e) { Logger.log('Error: ' + e); }

  Logger.log('\n--- GSC: Test query ---');
  try {
    const end   = offsetDate(new Date(), -1);
    const start = offsetDate(new Date(), -7);
    const url   = 'https://searchconsole.googleapis.com/webmasters/v3/sites/' +
                  encodeURIComponent(CONFIG.SITE_URL) + '/searchAnalytics/query';
    const r = UrlFetchApp.fetch(url, {
      method: 'post', contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + token },
      payload: JSON.stringify({ startDate: start, endDate: end, rowLimit: 3 }),
      muteHttpExceptions: true,
    });
    Logger.log('Response ' + r.getResponseCode() + ': ' + r.getContentText());
  } catch (e) { Logger.log('Error: ' + e); }

  Logger.log('\n--- GA4: Test query (direct REST) ---');
  try {
    const end   = offsetDate(new Date(), -1);
    const start = offsetDate(new Date(), -7);
    const url   = 'https://analyticsdata.googleapis.com/v1beta/properties/' +
                  CONFIG.GA4_PROPERTY_ID + ':runReport';
    const r = UrlFetchApp.fetch(url, {
      method: 'post', contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + token },
      payload: JSON.stringify({
        dateRanges: [{ startDate: start, endDate: end }],
        metrics: [{ name: 'sessions' }],
      }),
      muteHttpExceptions: true,
    });
    Logger.log('GA4 response ' + r.getResponseCode() + ': ' + r.getContentText().slice(0, 500));
  } catch (e) { Logger.log('GA4 error: ' + e); }

  Logger.log('\n=== DEBUG COMPLETE ===');
}
