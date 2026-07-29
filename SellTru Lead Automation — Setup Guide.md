# SellTru Lead Automation — Setup Guide

**What this builds:** A fully automated lead response system that sends a personalized email within 4 minutes of every form submission, creates a contact and deal in HubSpot, follows up at 48 hours if no response, and updates the pipeline automatically when a call is booked on Calendly.

**Time to configure:** ~90 minutes  
**Tools:** HubSpot (free) · Zapier (starter) · Calendly (free) · Microsoft Outlook · Apollo (native sync)

---

## System Overview

| Automation | Trigger | What It Does |
|---|---|---|
| **Zap 1 — Instant Response** | Form submission | Sends personalized email in 4 min, creates HubSpot contact + deal, notifies Andrew |
| **Zap 2 — 48h Follow-up** | Form submission | Waits 48 hours, checks if deal is still unresponded, sends follow-up if so |
| **Zap 3 — Call Booked** | Calendly booking | Updates deal stage to "Call Booked," emails Andrew a pre-call briefing |
| **Apollo Sync** | Native integration | Apollo contacts and sequence replies flow into HubSpot automatically |

**Lead routing logic (built into Zap 1):**
- **Path A — Qualified:** Revenue is anything except pre-launch → Full consultative email
- **Path B — Pre-launch:** Revenue = pre-launch → Short qualifying email only, skip 48h follow-up

---

## PART 1: HubSpot Setup
*Do this before building any Zaps. Estimated time: 15 minutes.*

### 1A — Create the Deal Pipeline

Go to **HubSpot → Settings (gear icon) → CRM → Deals → Pipelines → Add Pipeline**

Name it: **SellTru Sales**

Add these stages in order:
1. New Lead
2. Emailed
3. Replied
4. Call Booked
5. Call Completed
6. Proposal Sent
7. Closed Won
8. Closed Lost

Click Save.

### 1B — Create Custom Contact Properties

Go to **HubSpot → Settings → CRM → Properties → Contact Properties → Create Property** (repeat for each below)

| Property Label | Internal Name | Field Type | Options |
|---|---|---|---|
| Marketplace Interest | marketplace_interest | Dropdown | Amazon · Walmart · Both · Exploring |
| Revenue Range | revenue_range | Dropdown | Pre-launch · Under $250K · $250K–$1M · $1M–$5M · $5M–$20M · Over $20M |
| Monthly Ad Spend | monthly_ad_spend | Dropdown | None · Under $2K · $2K–$10K · $10K–$50K · $50K+ |
| Lead Source | lead_source | Dropdown | Website Form · Apollo · Facebook Ads · Referral |
| Lead Tier | lead_tier | Dropdown | A — Hot · B — Warm · C — Pre-launch |

Click Save after each one.

---

## PART 2: Zap 1 — Instant Response

*This is the main Zap. Build this one first.*

### Step 1 — Trigger: HubSpot

- App: **HubSpot**
- Trigger event: **New Submission**
- Connect your HubSpot account
- Test the trigger to confirm it pulls in all fields

**Fields you will use throughout this Zap:**

| HubSpot Field | What It Contains |
|---|---|
| `first-name` | Lead's first name |
| `last-name` | Lead's last name |
| `email` | Lead's email |
| `phone` | Phone number |
| `company` | Company / brand name |
| `marketplace` | amazon · walmart · both · new |
| `revenue` | pre-launch · under-250k · 250k-1m · 1m-5m · 5m-20m · over-20m |
| `adspend` | none · under-2k · 2k-10k · 10k-50k · 50k-plus |
| `message` | Free-text message (may be blank) |

### Step 2 — Delay: 4 Minutes

- App: **Delay by Zapier**
- Action: **Delay For...**
- Time: `4` Minutes

*This makes the email feel like you read the form and responded, not like a bot fired instantly.*

### Step 3 — AI Personalization

- App: **AI by Zapier** (or **OpenAI**)
- Action: **Generate Text (GPT-4o)**
- User Message: Copy this prompt exactly, inserting the dynamic HubSpot fields where indicated:

---

```
You are writing one paragraph on behalf of Andrew Deramo, founder of SellTru — a PPC agency specializing in Amazon and Walmart advertising for brands doing $250K+ in marketplace revenue.

Write exactly 2–3 sentences in Andrew's voice: direct, confident, and expert without being arrogant. The paragraph should reference this specific lead's situation and feel like Andrew personally read their form and responded.

Voice rules:
- No em dashes
- No words like "leverage", "unlock", "dive into", "game-changer", "partnership", or "journey"
- No filler phrases like "I hope this finds you well"
- Speak like a knowledgeable peer, not a salesperson
- If the message field is blank, focus on their marketplace and revenue stage instead

Lead details:
- Company: [INSERT company FIELD]
- Marketplace: [INSERT marketplace FIELD] (amazon=Amazon, walmart=Walmart, both=Amazon and Walmart, new=exploring marketplaces)
- Revenue: [INSERT revenue FIELD] (pre-launch=not yet selling, under-250k=under $250K/year, 250k-1m=$250K–$1M/year, 1m-5m=$1M–$5M/year, 5m-20m=$5M–$20M/year, over-20m=over $20M/year)
- Monthly ad spend: [INSERT adspend FIELD] (none=no current spend, under-2k=under $2K/mo, 2k-10k=$2K–$10K/mo, 10k-50k=$10K–$50K/mo, 50k-plus=over $50K/mo)
- Their message: [INSERT message FIELD]

Write ONLY the 2–3 sentence paragraph. No greeting. No sign-off. No subject line.
```

---

Save the output as `ai_paragraph` — you'll reference it in the email step.

### Step 4 — Paths (Lead Routing)

- App: **Paths by Zapier**
- Add two paths:

**Path A — Qualified Lead:**
- Condition: `revenue` does not exactly match `pre-launch`
- (This catches all revenue stages above pre-launch)

**Path B — Pre-launch Lead:**
- Condition: `revenue` exactly matches `pre-launch`

*All remaining steps below are configured inside each path separately.*

---

### PATH A STEPS (Qualified Lead)

#### Path A — Step 4a: Send Email via Microsoft Outlook

- App: **Microsoft Outlook**
- Action: **Send Email**
- From: `andrew@selltru.com`
- To: `[INSERT email FIELD]`
- Subject: Use this logic — 
  - If marketplace = walmart or both → `[INSERT company FIELD] — Walmart Ads`
  - If marketplace = amazon → `[INSERT company FIELD] — Amazon PPC`
  - If marketplace = new → `[INSERT company FIELD] — Marketplace Advertising`
  - *In Zapier, use a Formatter step before this if you want to auto-switch the subject. Or just use one generic subject:* `[INSERT company FIELD] — Let's Talk`

- Body (copy exactly, inserting dynamic fields):

```
Hi [INSERT first-name FIELD],

Thanks for reaching out.

[INSERT ai_paragraph FROM STEP 3]

At SellTru we handle Amazon and Walmart ad management end-to-end — campaign strategy, keyword targeting, bid management, and ongoing optimization. Flat monthly retainer, no percentage of spend. Most clients are running within 14 days of signing.

I'd like to get on a 20-minute call to understand your goals and walk you through exactly what we'd do for [INSERT company FIELD]. Here's my calendar: [YOUR CALENDLY LINK]

Andrew Deramo
SellTru
andrew@selltru.com
```

#### Path A — Step 4b: Create/Update Contact in HubSpot

- App: **HubSpot**
- Action: **Create or Update Contact**
- Map these fields:

| HubSpot Field | Value |
|---|---|
| First Name | `first-name` |
| Last Name | `last-name` |
| Email | `email` |
| Phone Number | `phone` |
| Company Name | `company` |
| Marketplace Interest | `marketplace` |
| Revenue Range | `revenue` |
| Monthly Ad Spend | `adspend` |
| Lead Source | Set manually: `Website Form` |
| Lead Tier | Set manually: `A — Hot` (you can refine this later) |

#### Path A — Step 4c: Create Deal in HubSpot

- App: **HubSpot**
- Action: **Create Deal**
- Map these fields:

| HubSpot Field | Value |
|---|---|
| Deal Name | `[company] — Website Lead` |
| Pipeline | SellTru Sales |
| Deal Stage | Emailed |
| Associated Contact | Use contact ID from Step 4b |
| Close Date | 30 days from today |

#### Path A — Step 4d: Notify Andrew

- App: **Microsoft Outlook**
- Action: **Send Email**
- To: `andrew@selltru.com`
- Subject: `New Lead: [INSERT company FIELD] — [INSERT marketplace FIELD] — [INSERT revenue FIELD]`
- Body:

```
New form submission on SellTru.com

Name: [INSERT first-name FIELD] [INSERT last-name FIELD]
Company: [INSERT company FIELD]
Email: [INSERT email FIELD]
Phone: [INSERT phone FIELD]
Marketplace: [INSERT marketplace FIELD]
Revenue: [INSERT revenue FIELD]
Ad Spend: [INSERT adspend FIELD]

Message:
[INSERT message FIELD]

---
Lead Tier: A — Qualified
Email sent automatically. Check HubSpot for deal.
```

---

### PATH B STEPS (Pre-launch Lead)

#### Path B — Step 4a: Send Email via Microsoft Outlook

- App: **Microsoft Outlook**
- Action: **Send Email**
- From: `andrew@selltru.com`
- To: `[INSERT email FIELD]`
- Subject: `[INSERT company FIELD] — Marketplace Ads`
- Body:

```
Hi [INSERT first-name FIELD],

Thanks for reaching out.

[INSERT ai_paragraph FROM STEP 3]

Happy to get on a quick 15-minute call to understand where [INSERT company FIELD] is headed and tell you honestly whether we'd be a good fit right now. Here's my calendar: [YOUR CALENDLY LINK]

Andrew Deramo
SellTru
andrew@selltru.com
```

#### Path B — Step 4b: Create/Update Contact in HubSpot

Same as Path A — Step 4b, but set Lead Tier to `C — Pre-launch`.

#### Path B — Step 4c: Create Deal in HubSpot

Same as Path A — Step 4c, but set Deal Stage to `New Lead` (not Emailed — pre-launch leads warrant more caution before claiming they've been engaged).

#### Path B — Step 4d: Notify Andrew

Same structure as Path A notification, but change the last line to:
`Lead Tier: C — Pre-launch. Short qualifying email sent. Worth a quick call to understand their timeline.`

---

## PART 3: Zap 2 — 48-Hour Follow-up

*This Zap runs in parallel with Zap 1. It only sends a follow-up to qualified leads (not pre-launch) who haven't booked or replied.*

### Step 1 — Trigger: HubSpot (same as Zap 1)

Same trigger setup. This Zap starts at the same moment as Zap 1 but waits before acting.

### Step 2 — Filter: Skip Pre-launch

- App: **Filter by Zapier**
- Only continue if: `revenue` does not exactly match `pre-launch`

### Step 3 — Delay: 48 Hours

- App: **Delay by Zapier**
- Action: **Delay For...**
- Time: `48` Hours

### Step 4 — Find Deal in HubSpot

- App: **HubSpot**
- Action: **Find Deal**
- Search by: Associated Contact Email = `[INSERT email FIELD]`

### Step 5 — Filter: Only Follow Up if Still Unresponded

- App: **Filter by Zapier**
- Only continue if: Deal Stage from Step 4 exactly matches `Emailed`
- (If they've replied, booked, or moved forward, the stage will have changed and this Zap stops here)

### Step 6 — Send Follow-up Email via Microsoft Outlook

- App: **Microsoft Outlook**
- Action: **Send Email**
- From: `andrew@selltru.com`
- To: `[INSERT email FIELD]`
- Subject: `Re: [INSERT company FIELD] — Let's Talk`
- Body:

```
Hi [INSERT first-name FIELD],

Just making sure my last note didn't get buried.

If you're still exploring [INSERT marketplace FIELD] ads, I'm happy to jump on a quick call this week and give you a straight answer on whether we'd be a good fit.

[YOUR CALENDLY LINK]

Andrew
```

---

## PART 4: Zap 3 — Calendly Booking → HubSpot Update

*When someone books a call, this Zap updates their deal stage and briefs Andrew.*

### Step 1 — Trigger: Calendly

- App: **Calendly**
- Trigger event: **Invitee Created** (fires when someone books)
- Connect your Calendly account and select your discovery call event

### Step 2 — Find Contact in HubSpot

- App: **HubSpot**
- Action: **Find Contact**
- Search by: Email = invitee email from Calendly

### Step 3 — Find Deal in HubSpot

- App: **HubSpot**
- Action: **Find Deal**
- Search by: Associated Contact ID from Step 2

### Step 4 — Update Deal Stage

- App: **HubSpot**
- Action: **Update Deal**
- Deal ID: from Step 3
- Deal Stage: `Call Booked`

### Step 5 — Email Andrew Pre-call Briefing

- App: **Microsoft Outlook**
- Action: **Send Email**
- To: `andrew@selltru.com`
- Subject: `Call Booked: [invitee name] — [scheduled time from Calendly]`
- Body:

```
[INVITEE NAME] just booked a call for [SCHEDULED START TIME FROM CALENDLY].

Their form details:
Pull from HubSpot contact properties if available, or reference HubSpot contact link.

Prep notes:
- Check their marketplace focus and revenue range in HubSpot
- Review their original message
- Have pricing ready: $2,500–$3,000/mo flat retainer for $1M+ brands

HubSpot deal: [link to deal if available]
```

*Note: Calendly passes the invitee's name and email. The rest of their details live in HubSpot from Zap 1.*

---

## PART 5: Apollo → HubSpot Native Sync

*No Zap needed. This is a native integration inside Apollo.*

1. In Apollo, go to **Settings → Integrations → HubSpot**
2. Click **Connect**
3. Authorize with your HubSpot account
4. Enable **Two-way sync**
5. Under sync settings, enable:
   - Sync contacts to HubSpot
   - Log email activity (sends, opens, clicks, replies)
   - Create deals on reply (set stage to "Replied")

Once connected, every contact in your National and South Florida sequences will appear in HubSpot. When someone replies to an Apollo sequence, a deal is created automatically at the "Replied" stage — same pipeline, different source.

**One important setting:** In Apollo's HubSpot sync, set "Lead Source" to `Apollo` so you can distinguish website inbound from cold outbound in your pipeline.

---

## PART 6: Test the Full System

Before going live, send a test submission through your own form:

1. Go to selltru.com/about (or your form page) and submit with your own email
2. Wait 4 minutes — confirm the personalized email arrives in your inbox
3. Check HubSpot — confirm contact and deal were created at the right stage
4. Check your andrew@selltru.com inbox — confirm the notification arrived
5. Book a test call on Calendly — confirm deal stage updates to "Call Booked" in HubSpot
6. Wait 48 hours (or temporarily change the delay to 2 minutes for testing) — confirm the follow-up sends

If any step fails, Zapier's task history will show exactly where it broke.

---

## PART 7: Single Form — Three-Path Routing

**Confirmed:** All forms on selltru.com submit directly to HubSpot via the Forms Submissions API. No Formspree — submissions go straight into HubSpot contacts.

The Zap routes correctly based on whether the revenue field is populated:

| Path | Condition | Action |
|---|---|---|
| **Path A — Qualified** | revenue has a value AND is not "pre-launch" | Full consultative email + HubSpot deal (stage: Emailed) |
| **Path B — Pre-launch** | revenue = "pre-launch" | Short qualifying email + HubSpot deal (stage: New Lead) |
| **Path C — Lead Magnet** | revenue is empty/blank | Qualifying email asking about their business + HubSpot contact (no deal yet) |

### How It Works
Forms submit directly to `https://api.hsforms.com/submissions/v3/integration/submit/246322145/afb91a90-3757-489a-ba33-d5588bd111c0`. HubSpot creates or updates the contact automatically. Zapier triggers on **New Contact** in HubSpot.

### Path C Email (Lead Magnet)
Subject: `Quick question, [first name]`

> Hey [first name],
>
> You grabbed the checklist — nice. Quick question before I follow up properly:
>
> Are you currently selling on Amazon or Walmart, or are you still in the research phase?
>
> Just reply back. Takes 10 seconds and it helps me send you something actually useful.
>
> — Andrew
> Founder, SellTru

---

## APPENDIX A: Email Templates (Clean Copy)

### Template A — Qualified Lead (Path A)

**Subject:** [Company] — Walmart Ads / Amazon PPC / Let's Talk

```
Hi [First Name],

Thanks for reaching out.

[AI PARAGRAPH]

At SellTru we handle Amazon and Walmart ad management end-to-end — campaign strategy, keyword targeting, bid management, and ongoing optimization. Flat monthly retainer, no percentage of spend. Most clients are running within 14 days of signing.

I'd like to get on a 20-minute call to understand your goals and walk you through exactly what we'd do for [Company]. Here's my calendar: [CALENDLY LINK]

Andrew Deramo
SellTru
andrew@selltru.com
```

### Template B — Pre-launch Lead (Path B)

**Subject:** [Company] — Marketplace Ads

```
Hi [First Name],

Thanks for reaching out.

[AI PARAGRAPH]

Happy to get on a quick 15-minute call to understand where [Company] is headed and tell you honestly whether we'd be a good fit right now. Here's my calendar: [CALENDLY LINK]

Andrew Deramo
SellTru
andrew@selltru.com
```

### Template C — 48-Hour Follow-up

**Subject:** Re: [Company] — Let's Talk

```
Hi [First Name],

Just making sure my last note didn't get buried.

If you're still exploring [marketplace] ads, I'm happy to jump on a quick call this week and give you a straight answer on whether we'd be a good fit.

[CALENDLY LINK]

Andrew
```

---
### Template D — Lead Magnet Qualifying Email (Zap 4)

**Subject:** your SellTru signup

```
Hey [First Name],

Saw you filled out the form on selltru.com — thanks for reaching out.

Before I put anything together: what kind of product or brand are you building? And are you on Amazon or Walmart yet, or still working toward that?

Reply back with a sentence or two and I will make sure whatever I send you actually fits your situation. Or if it is easier to just talk: [CALENDLY LINK]

Andrew Deramo
SellTru
andrew@selltru.com
```

*Note: This template is used when the lead came through the simple lead magnet form and has no marketplace or revenue data. The goal is one qualifying question, not a pitch.*

---

## APPENDIX B: AI Prompt (Final Version)

Copy this exactly into the Zapier AI step. Replace bracketed placeholders with the corresponding HubSpot dynamic fields.

```
You are writing one paragraph on behalf of Andrew Deramo, founder of SellTru — a PPC agency specializing in Amazon and Walmart advertising for brands doing $250K+ in marketplace revenue.

Write exactly 2–3 sentences in Andrew's voice: direct, confident, and expert without being arrogant. The paragraph should reference this specific lead's situation and feel like Andrew personally read their form and responded.

Voice rules:
- No em dashes
- No words like "leverage", "unlock", "dive into", "game-changer", "partnership", or "journey"
- No filler phrases like "I hope this finds you well"
- Speak like a knowledgeable peer, not a salesperson
- If the message field is blank, focus on their marketplace and revenue stage instead

Lead details:
- Company: [company]
- Marketplace: [marketplace] (amazon=Amazon, walmart=Walmart, both=Amazon and Walmart, new=exploring marketplaces)
- Revenue: [revenue] (pre-launch=not yet selling, under-250k=under $250K/year, 250k-1m=$250K–$1M/year, 1m-5m=$1M–$5M/year, 5m-20m=$5M–$20M/year, over-20m=over $20M/year)
- Monthly ad spend: [adspend] (none=no current spend, under-2k=under $2K/mo, 2k-10k=$2K–$10K/mo, 10k-50k=$10K–$50K/mo, 50k-plus=over $50K/mo)
- Their message: [message]

Write ONLY the 2–3 sentence paragraph. No greeting. No sign-off. No subject line.
```

---

## APPENDIX C: Field Mapping Quick Reference

| HubSpot Field Name | Example Value | Used In |
|---|---|---|
| `first-name` | Jessica | Email greeting, notification |
| `last-name` | Liu | HubSpot contact, notification |
| `email` | pethealth@yoyobay.com | Send-to address, HubSpot |
| `phone` | 5551234567 | HubSpot contact |
| `company` | YoYoBay | Email body, deal name, HubSpot |
| `marketplace` | walmart | Email subject, AI prompt, HubSpot |
| `revenue` | 250k-1m | Lead routing, AI prompt, HubSpot |
| `adspend` | none | AI prompt, HubSpot |
| `message` | Hi, I am Jessica... | AI prompt, notification |

---

*Last updated: May 27, 2026 — Migrated from Formspree to HubSpot Forms API. All forms now submit directly to HubSpot. Zap triggers updated to HubSpot New Contact.*
