// HNVNS 30-Day Execution Plan — DOCX Generator
// Document type: proposal/plan → R4 cover recipe, but title >20 chars → override to R1
// Palette: GO-1 Graphite Orange (proposals, bidding, PRD)

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  PageOrientation, TableLayoutType, SectionType, TableOfContents,
} = require("docx");
const fs = require("fs");

// ──────────────────────────────────────────────────────────────
// PALETTE (GO-1 Graphite Orange)
// ──────────────────────────────────────────────────────────────
const P = {
  bg: "1A2330",
  primary: "FFFFFF",
  accent: "D4875A",
  titleColor: "FFFFFF",
  subtitleColor: "B0B8C0",
  metaColor: "90989F",
  footerColor: "687078",
  headerBg: "D4875A",
  headerText: "FFFFFF",
  innerLine: "DDD0C8",
  surface: "F8F0EB",
  // body-page text colors
  bodyPrimary: "1A2330",
  bodyText: "000000",
  bodySecondary: "506070",
};

const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ──────────────────────────────────────────────────────────────
// COVER HELPERS — calcTitleLayout + calcCoverSpacing
// ──────────────────────────────────────────────────────────────
function splitTitleLines(title, charsPerLine) {
  if (title.length <= charsPerLine) return [title];
  const breakAfter = new Set([...' \t-_/', ...'，。、；：！？']);
  const lines = [];
  let remaining = title;
  while (remaining.length > charsPerLine) {
    let breakAt = -1;
    for (let i = charsPerLine; i >= Math.floor(charsPerLine * 0.6); i--) {
      if (i < remaining.length && breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
    }
    if (breakAt === -1) {
      const limit = Math.min(remaining.length, Math.ceil(charsPerLine * 1.3));
      for (let i = charsPerLine + 1; i < limit; i++) {
        if (breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
      }
    }
    if (breakAt === -1) breakAt = charsPerLine;
    lines.push(remaining.slice(0, breakAt).trim());
    remaining = remaining.slice(breakAt).trim();
  }
  if (remaining) lines.push(remaining);
  if (lines.length > 1 && lines[lines.length - 1].length <= 2) {
    const last = lines.pop();
    lines[lines.length - 1] += " " + last;
  }
  return lines;
}

function calcTitleLayout(title, maxWidthTwips, preferredPt = 40, minPt = 24) {
  // For English, each char ≈ pt × 11 twips (narrower than CJK)
  const charWidth = (pt) => pt * 11;
  const charsPerLine = (pt) => Math.floor(maxWidthTwips / charWidth(pt));
  let titlePt = preferredPt;
  let lines;
  while (titlePt >= minPt) {
    const cpl = charsPerLine(titlePt);
    if (cpl < 2) { titlePt -= 2; continue; }
    lines = splitTitleLines(title, cpl);
    if (lines.length <= 3) break;
    titlePt -= 2;
  }
  if (!lines || lines.length > 3) {
    lines = splitTitleLines(title, charsPerLine(minPt));
    titlePt = minPt;
  }
  return { titlePt, titleLines: lines };
}

function calcCoverSpacing(params) {
  const { titleLineCount = 1, titlePt = 36, hasSubtitle = false, hasEnglishLabel = false,
    metaLineCount = 0, fixedHeight = 800, pageHeight = 16838, marginTop = 0, marginBottom = 0 } = params;
  const SAFETY = 1200;
  const usableHeight = pageHeight - marginTop - marginBottom - SAFETY;
  const titleHeight = titleLineCount * (titlePt * 23 + 200);
  const subtitleHeight = hasSubtitle ? (12 * 23 + 600) : 0;
  const englishLabelHeight = hasEnglishLabel ? (9 * 23 + 600) : 0;
  const metaHeight = metaLineCount * (10 * 23 + 100);
  const implicitParaHeight = 3 * 300;
  const contentHeight = titleHeight + subtitleHeight + englishLabelHeight + metaHeight + fixedHeight + implicitParaHeight;
  const remainingSpace = usableHeight - contentHeight;
  const safeRemaining = Math.max(remainingSpace, 400);
  const FOOTER_MIN = 800;
  const rawTop = Math.floor(safeRemaining * 0.45);
  const rawBottom = Math.floor(safeRemaining * 0.45);
  const bottomSpacing = Math.max(rawBottom, FOOTER_MIN);
  const topSpacing = Math.max(rawTop - Math.max(0, FOOTER_MIN - rawBottom), 400);
  const midSpacing = Math.max(safeRemaining - topSpacing - bottomSpacing, 0);
  return { topSpacing, midSpacing, bottomSpacing };
}

// ──────────────────────────────────────────────────────────────
// COVER (R1 — Pure Paragraph, Left-Aligned)
// ──────────────────────────────────────────────────────────────
function buildCover(config) {
  const padL = 1200, padR = 800;
  const availableWidth = 11906 - padL - padR - 300;
  const { titlePt, titleLines } = calcTitleLayout(config.title, availableWidth, 40, 24);
  const titleSize = titlePt * 2;
  const spacing = calcCoverSpacing({
    titleLineCount: titleLines.length, titlePt,
    hasSubtitle: !!config.subtitle, hasEnglishLabel: !!config.englishLabel,
    metaLineCount: (config.metaLines || []).length, fixedHeight: 400,
  });
  const accentLeft = { style: BorderStyle.SINGLE, size: 8, color: P.accent, space: 12 };
  const children = [];

  children.push(new Paragraph({ spacing: { before: spacing.topSpacing } }));

  if (config.englishLabel) {
    children.push(new Paragraph({
      indent: { left: padL, right: padR }, spacing: { after: 500 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: P.accent, space: 8 } },
      children: [new TextRun({ text: config.englishLabel.split("").join("  "),
        size: 18, color: P.accent, font: { ascii: "Calibri", eastAsia: "SimHei" }, characterSpacing: 40 })],
    }));
  }

  for (let i = 0; i < titleLines.length; i++) {
    children.push(new Paragraph({
      indent: { left: padL },
      spacing: { after: i < titleLines.length - 1 ? 100 : 300, line: Math.ceil(titlePt * 23), lineRule: "atLeast" },
      children: [new TextRun({ text: titleLines[i], size: titleSize, bold: true,
        color: P.titleColor, font: { eastAsia: "SimHei", ascii: "Arial" } })],
    }));
  }

  if (config.subtitle) {
    children.push(new Paragraph({
      indent: { left: padL }, spacing: { after: 800 },
      children: [new TextRun({ text: config.subtitle, size: 24, color: P.subtitleColor,
        font: { eastAsia: "Microsoft YaHei", ascii: "Arial" } })],
    }));
  }

  for (const line of (config.metaLines || [])) {
    children.push(new Paragraph({
      indent: { left: padL + 200 }, spacing: { after: 80 },
      border: { left: accentLeft },
      children: [new TextRun({ text: line, size: 24, color: P.metaColor,
        font: { eastAsia: "Microsoft YaHei", ascii: "Arial" } })],
    }));
  }

  children.push(new Paragraph({ spacing: { before: spacing.bottomSpacing } }));

  children.push(new Paragraph({
    indent: { left: padL, right: padR },
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: P.accent, space: 8 } },
    spacing: { before: 200 },
    children: [
      new TextRun({ text: config.footerLeft || "", size: 16, color: P.footerColor, font: { ascii: "Arial" } }),
      new TextRun({ text: "                                        " }),
      new TextRun({ text: config.footerRight || "", size: 16, color: P.footerColor, font: { ascii: "Arial" } }),
    ],
  }));

  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: P.bg }, borders: noBorders, children,
      })],
    })],
  })];
}

// ──────────────────────────────────────────────────────────────
// CONTENT BUILDERS
// ──────────────────────────────────────────────────────────────
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200, line: 360 },
    children: [new TextRun({ text, bold: true, size: 32, color: P.bodyPrimary,
      font: { ascii: "Calibri", eastAsia: "SimHei" } })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 140, line: 340 },
    children: [new TextRun({ text, bold: true, size: 28, color: P.bodyPrimary,
      font: { ascii: "Calibri", eastAsia: "SimHei" } })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 220, after: 100, line: 320 },
    children: [new TextRun({ text, bold: true, size: 25, color: P.bodyPrimary,
      font: { ascii: "Calibri", eastAsia: "SimHei" } })],
  });
}

function p(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120, line: 312 },
    children: [new TextRun({ text, size: 22, color: P.bodyText,
      font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
  });
}

// Paragraph with mixed runs (bold lead-in + body)
function pb(leadBold, rest) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120, line: 312 },
    children: [
      new TextRun({ text: leadBold, bold: true, size: 22, color: P.bodyText,
        font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
      new TextRun({ text: rest, size: 22, color: P.bodyText,
        font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
    ],
  });
}

// Bullet point (using a real numbering-free visual bullet)
function bullet(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 80, line: 300 },
    indent: { left: 360, hanging: 220 },
    children: [
      new TextRun({ text: "\u2022  ", size: 22, color: P.accent, bold: true,
        font: { ascii: "Calibri" } }),
      new TextRun({ text, size: 22, color: P.bodyText,
        font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
    ],
  });
}

function bulletBold(leadBold, rest) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 80, line: 300 },
    indent: { left: 360, hanging: 220 },
    children: [
      new TextRun({ text: "\u2022  ", size: 22, color: P.accent, bold: true,
        font: { ascii: "Calibri" } }),
      new TextRun({ text: leadBold, bold: true, size: 22, color: P.bodyText,
        font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
      new TextRun({ text: rest, size: 22, color: P.bodyText,
        font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
    ],
  });
}

function spacer() {
  return new Paragraph({ spacing: { after: 60 } });
}

// ──────────────────────────────────────────────────────────────
// TABLE BUILDERS
// ──────────────────────────────────────────────────────────────
function dataTable(headers, rows, colWidths) {
  const widths = colWidths || headers.map(() => Math.floor(100 / headers.length));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: P.accent },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: P.accent },
      left: NB, right: NB,
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: P.innerLine },
      insideVertical: NB,
    },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: headers.map((text, i) => new TableCell({
          width: { size: widths[i], type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: P.headerBg },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({ text, bold: true, size: 20, color: P.headerText,
              font: { ascii: "Calibri", eastAsia: "SimHei" } })],
          })],
        })),
      }),
      ...rows.map((row, ri) => new TableRow({
        cantSplit: true,
        children: row.map((cellText, ci) => new TableCell({
          width: { size: widths[ci], type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: ri % 2 === 0 ? P.surface : "FFFFFF" },
          margins: { top: 70, bottom: 70, left: 120, right: 120 },
          children: [new Paragraph({
            spacing: { line: 280 },
            children: [new TextRun({ text: String(cellText), size: 19, color: P.bodyText,
              font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
          })],
        })),
      })),
    ],
  });
}

// Title paragraph that stays with the table below it
function tableTitle(text) {
  return new Paragraph({
    keepNext: true,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 21, color: P.bodyPrimary,
      font: { ascii: "Calibri", eastAsia: "SimHei" } })],
  });
}

// ──────────────────────────────────────────────────────────────
// FOOTER BUILDERS
// ──────────────────────────────────────────────────────────────
function footerArabic() {
  return new Footer({ children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080",
      font: { ascii: "Calibri" } })],
  })] });
}

function footerRoman() {
  return new Footer({ children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080",
      font: { ascii: "Calibri" } })],
  })] });
}

// ──────────────────────────────────────────────────────────────
// BODY CONTENT — All 10 chapters
// ──────────────────────────────────────────────────────────────
const body = [];

// ── EXECUTIVE SUMMARY ──
body.push(h1("Executive Summary"));
body.push(p("This document presents a complete, execution-focused 30-day growth plan for HNVNS, a specialized radiology and imaging workforce platform headquartered in Bangalore, Karnataka, India. The plan is designed around a single overriding objective: acquire the first paying hospital clients as quickly as possible while simultaneously building a qualified candidate pool of 500+ imaging professionals (MRI, CT, X-Ray, and Cath Lab technologists)."));
body.push(p("The strategy rests on five pillars: (1) direct, founder-led hospital acquisition targeting the dense Bangalore-Karnataka healthcare cluster, (2) rapid candidate acquisition through college partnerships, WhatsApp communities, and referral incentives, (3) a lean digital marketing engine anchored on LinkedIn and local SEO, (4) a disciplined sales system using a free CRM with defined pipeline stages and KPIs, and (5) selective automation to multiply the effort of a small team. The plan assumes a limited budget and therefore prioritizes high-conviction outbound outreach, warm founder relationships, and community-led growth over paid advertising."));
body.push(p("By Day 30, the target outcomes are: 3 signed or piloting hospital clients, 500 verified candidates in the pipeline, 1-2 paid placements in progress, a fully operational CRM with 150+ logged conversations, and a content and SEO foundation that begins compounding. The roadmap is sequenced so that infrastructure (CRM, tracking, website fixes) is built in the first week, while outreach velocity ramps from Day 4 onward."));
body.push(p("Key risks are identified at the end of this document, including long hospital procurement cycles, candidate quality variance, and competitive pressure from established agencies. Each risk carries a specific mitigation. The plan deliberately front-loads the highest-leverage activities — leveraging the founder's senior radiology network and the team's clinical credibility — because these are the moats no general staffing agency can replicate."));

body.push(spacer());
body.push(h2("30-Day Targets at a Glance"));
body.push(tableTitle("Table 1: Primary targets by Day 30"));
body.push(dataTable(
  ["Metric", "Day 30 Target", "Stretch Target"],
  [
    ["Paying / piloting hospital clients", "3", "5"],
    ["Hospital conversations started", "150", "220"],
    ["Qualified site visits / discovery calls", "25", "40"],
    ["Candidates in verified pipeline", "500", "750"],
    ["Paid placements in progress", "1-2", "3"],
    ["College partnerships signed", "3", "5"],
    ["LinkedIn followers (founder + company)", "800", "1,500"],
    ["Revenue booked (INR)", "1,50,000 - 3,00,000", "6,00,000"],
  ],
  [45, 30, 25]
));

body.push(new Paragraph({ children: [new PageBreak()] }));

// ════════════════════════════════════════════════════════════
// CHAPTER 1: HOSPITAL ACQUISITION
// ════════════════════════════════════════════════════════════
body.push(h1("1. Hospital Acquisition"));
body.push(p("Hospital acquisition is the revenue engine of HNVNS. Unlike general healthcare staffing, radiology and imaging staffing is a specialist need — hospitals struggle to find credentialed MRI and CT technologists, and turnover in these roles is high. This scarcity is HNVNS's wedge. The acquisition strategy targets the decision-makers who feel this pain most acutely: department heads of radiology, imaging facility managers, hospital administrators, and HR business partners."));

body.push(h2("1.1 Identifying and Mapping Target Accounts"));
body.push(p("Begin by building a ranked target account list (TAL) of 200 hospitals, diagnostic chains, and imaging centers across Bangalore and major Karnataka cities (Mysuru, Mangaluru, Hubballi, Belagavi). Rank accounts by three signals: imaging volume (does the facility run MRI/CT/Cath Lab?), growth signal (recent expansion, new equipment installations, job postings), and access (does the founder or co-founder have a personal contact?)."));
body.push(p("The Tier 1 list (top 40 accounts) receives the most attention — these are the accounts with the clearest pain and the warmest access path. Tier 2 (next 80) are strong-fit accounts reached via cold outreach. Tier 3 (remaining 80) are monitored and touched with lighter sequences."));

body.push(h3("Primary data sources for account discovery"));
body.push(bulletBold("Hospital websites and careers pages: ", "Scan for current radiology/imaging job openings, which signal active pain."));
body.push(bulletBold("LinkedIn company pages: ", "Identify HR managers, administrators, and heads of radiology/departments."));
body.push(bulletBold("Industry directories: ", "JustDial, Practo (lists 200+ radiology hospitals in Bangalore), and diagnostic centre aggregators provide facility-level data."));
body.push(bulletBold("Equipment vendor intelligence: ", "When a hospital announces a new MRI or CT scanner installation, staffing demand follows within 60-90 days. Monitor Siemens, GE, Philips, and United Imaging press releases and dealer announcements."));
body.push(bulletBold("Founder and co-founder networks: ", "The founder's senior radiology professor network is the single highest-value source. Warm introductions convert 5-10x better than cold outreach."));

body.push(tableTitle("Table 2: Target account segmentation by tier"));
body.push(dataTable(
  ["Tier", "Account Count", "Profile", "Outreach Method", "Weekly Touches"],
  [
    ["Tier 1", "40", "Warm access, high imaging volume, active hiring", "Founder-led, multi-channel", "3-5"],
    ["Tier 2", "80", "Strong fit, cold outreach", "Email + LinkedIn + call", "2-3"],
    ["Tier 3", "80", "Monitored, lighter fit", "Email sequence only", "1"],
  ],
  [10, 15, 35, 25, 15]
));

body.push(h2("1.2 Identifying and Approaching Decision-Makers"));
body.push(p("In hospitals, the buying decision for staffing is rarely made by one person. It is usually a committee: the head of radiology or imaging (clinical authority), the HR manager or HR business partner (process and compliance), and the administrator or COO (budget). Each stakeholder has different priorities, and your outreach must speak to each."));

body.push(tableTitle("Table 3: Decision-maker mapping and messaging angles"));
body.push(dataTable(
  ["Role", "Primary Pain", "Message Angle", "Where to Find Them"],
  [
    ["Head of Radiology / Imaging", "Scanner downtime due to absent technologists; quality risk", "Credential-verified talent, clinical credibility, fast coverage", "LinkedIn, medical conferences, founder network"],
    ["HR Manager / HRBP", "Slow hiring, high attrition, compliance paperwork", "Pre-screened, document-ready candidates, faster time-to-fill", "LinkedIn HR groups, Naukri, HR forums"],
    ["Hospital Administrator / COO", "Cost of locum coverage, operational risk", "Predictable staffing cost, reduced downtime, retainer flexibility", "LinkedIn, hospital leadership pages, industry events"],
    ["Diagnostic Centre Owner", "Cannot find specialist talent at all", "Access to a specialist-only talent pool", "Local associations, JustDial, referrals"],
  ],
  [22, 23, 30, 25]
));

body.push(h2("1.3 Daily Outreach Strategy"));
body.push(p("Outreach is a numbers game played with discipline. The daily target for the sales lead (you) during the 30-day sprint is: 30 new prospects contacted per day across all channels, broken into 15 LinkedIn actions, 8 personalised cold emails, 4 WhatsApp messages to warm contacts, and 3 outbound calls. This produces 150 contacts per week and 600 by Day 30, more than enough to fill a healthy pipeline."));

body.push(tableTitle("Table 4: Daily outreach activity targets"));
body.push(dataTable(
  ["Activity", "Daily Target", "Weekly Target", "Expected Response Rate"],
  [
    ["LinkedIn connection requests + messages", "15", "75", "15-25% accept, 5-10% reply"],
    ["Personalised cold emails", "8", "40", "8-15% reply"],
    ["WhatsApp messages (warm/warmish)", "4", "20", "30-50% reply"],
    ["Outbound phone calls", "3", "15", "20-30% connect, book 2-4 meetings"],
    ["Follow-ups (existing prospects)", "10", "50", "n/a"],
  ],
  [40, 15, 15, 30]
));

body.push(h3("Time blocking for outreach"));
body.push(bulletBold("09:00 - 10:30 (90 min): ", "Fresh prospecting — LinkedIn sourcing and connection requests, email research and sending. This is when decision-makers are most active on LinkedIn."));
body.push(bulletBold("11:00 - 12:00 (60 min): ", "Outbound calls — call the warmest leads, follow up on opened-but-unreplied emails, chase WhatsApp threads."));
body.push(bulletBold("14:00 - 14:30 (30 min): ", "WhatsApp follow-ups and referral asks."));
body.push(bulletBold("16:00 - 17:00 (60 min): ", "Follow-up sequences, CRM logging, and next-day prep."));

body.push(h2("1.4 LinkedIn Strategy"));
body.push(p("LinkedIn is the highest-leverage channel for B2B healthcare outreach in India. The strategy has three components: founder profile optimisation, company page establishment, and a disciplined outreach cadence."));

body.push(h3("Founder profile optimisation (Day 1-2)"));
body.push(bullet("Rewrite the headline to a value proposition, not a job title: \"Building India's specialist radiology workforce platform | Helping hospitals staff MRI, CT, X-Ray & Cath Lab roles faster | Senior Radiology Professor\"."));
body.push(bullet("Update the About section to lead with the problem (imaging talent shortage in Karnataka) and position HNVNS as the specialist solution. Mention credibility markers: years in radiology, hospitals worked with, scan volumes."));
body.push(bullet("Add a banner image showing the HNVNS value prop or a clean professional photo in a clinical setting."));
body.push(bullet("Turn on Creator Mode and set the profile to indicate you are open to connecting with HR and healthcare operations professionals."));

body.push(h3("Connection request script (personalised, under 200 characters)"));
body.push(p("Template: \"Hi [First Name], I lead HNVNS — we help [Hospital Name / Bangalore hospitals] staff credentialed MRI & CT technologists. I saw your radiology team is hiring and would value connecting.\""));
body.push(p("Rule: Never send a generic connection request. Always reference something specific — a recent post they wrote, a job opening, a hospital expansion, or a mutual connection. Personalisation triples acceptance rates."));

body.push(h3("Post-acceptance follow-up (Day 2 after acceptance)"));
body.push(p("Template: \"Thanks for connecting, [First Name]. At HNVNS we pre-screen and credential-verify imaging technologists so hospitals like [their hospital] can fill MRI/CT roles in days, not months. Would a 15-minute call this week be useful to share what roles you're finding hardest to fill? Happy to send 2-3 pre-vetted profiles first, no commitment.\""));

body.push(h2("1.5 Cold Email Strategy"));
body.push(p("Cold email is for accounts where you cannot get a warm introduction. The goal of a cold email is never to sell — it is to start a conversation. Emails must be short (under 120 words), personalised, and end with a low-friction question."));

body.push(h3("Cold email template — first touch"));
body.push(p("Subject: Staffing your MRI / CT roles at [Hospital Name]"));
body.push(p("Body: \"Hi [First Name], I lead HNVNS, a Bangalore-based platform that supplies credentialed MRI, CT, and X-Ray technologists to hospitals and diagnostic centres across Karnataka. I noticed [Hospital Name] has been hiring for [specific role, if known] and that imaging volume has been growing at your [location] facility. We pre-screen every candidate for technical skill and documentation, so placements happen in days rather than weeks. Would it be useful if I sent over 2-3 pre-vetted profiles matching your current openings? No cost or commitment to review. Best, [Name], [Title], HNVNS\""));

body.push(h3("Cold email rules"));
body.push(bullet("One clear ask per email. Never ask for a meeting AND a referral AND a profile review in one message."));
body.push(bullet("Personalise the first line — reference the hospital, a recent news item, or a specific role."));
body.push(bullet("Use a professional email address (founder@hnvns.com or similar), not a free Gmail for cold outreach."));
body.push(bullet("Send between 09:30 and 11:00 IST on Tuesday-Thursday for best open rates."));
body.push(bullet("Track opens with a lightweight tool (HubSpot free, Mailtrack) so you know when to follow up."));

body.push(h2("1.6 WhatsApp Strategy"));
body.push(p("WhatsApp is the dominant business communication channel in India, especially in healthcare. It is more effective than email for warm and warm-ish leads. The strategy is to move LinkedIn and email conversations to WhatsApp once there is any signal of interest, because response rates and speed are dramatically higher."));

body.push(h3("WhatsApp outreach principles"));
body.push(bulletBold("Permission first: ", "Never cold-spam on WhatsApp. Only message people who have connected on LinkedIn, replied to email, or been introduced. Unsolicited WhatsApp is seen as intrusive and damages reputation."));
body.push(bulletBold("Be human and brief: ", "Write like a person, not a brochure. One question per message. Voice notes (30 seconds) from the founder dramatically increase trust and reply rates."));
body.push(bulletBold("Lead with value: ", "When appropriate, send a pre-vetted candidate profile (anonymised) as proof of capability before asking for anything."));
body.push(bulletBold("Use broadcast lists, not groups, for prospects: ", "Create a broadcast list for warm prospects and share relevant content (a new insight post, a market update) once a week to stay top-of-mind."));

body.push(h3("WhatsApp follow-up script (after initial interest)"));
body.push(p("\"Hi [First Name], following up on our chat about imaging staffing at [Hospital]. I have 2 MRI technologist profiles pre-screened and document-ready, both with 3+ years experience on 1.5T and 3T systems. Shall I send the profiles over? Also happy to do a 10-min call to understand your current openings better.\""));

body.push(h2("1.7 Call Scripts"));
body.push(p("Calls are for warm leads — people who have replied, accepted a connection, or been referred. The objective of a first call is not to close; it is to qualify the need and book a discovery meeting or request job requirements."));

body.push(h3("Discovery call script (outline)"));
body.push(pb("Opening (30 sec): ", "\"Hi [Name], this is [Your Name] from HNVNS. Thanks for taking my call. I know you're busy, so I'll be quick — we help hospitals in Bangalore staff credentialed MRI, CT, and imaging technologists. Is this an okay time for 2-3 minutes?\""));
body.push(pb("Problem probe (90 sec): ", "\"I'd love to understand your situation. What imaging roles are you currently finding hardest to fill? ... How long have they been open? ... What's the impact on operations when a scanner goes unstaffed?\""));
body.push(pb("Credibility + value (60 sec): ", "\"That's exactly where we focus. We pre-screen every technologist for technical skill and have all compliance documents ready — AERB registration, radiation safety, certifications. So we can usually send pre-vetted profiles within 48 hours and place within 1-2 weeks. We also offer flexible retainer or per-placement models.\""));
body.push(pb("Ask / next step (30 sec): ", "\"Would it help if I sent over 2-3 pre-vetted profiles for your hardest-to-fill role this week? Or would a 20-minute discovery call with our founder, who is a senior radiology professor, be useful?\""));
body.push(pb("Close: ", "Confirm the next step, note it in the CRM, and send a WhatsApp summary within the hour."));

body.push(h2("1.8 Follow-Up Sequences"));
body.push(p("Most deals are won in the follow-up. A single touch is rarely enough; hospitals are busy and decisions slip. Build a disciplined multi-touch sequence for every account that does not respond on the first contact. The sequence below runs over 21 days and uses alternating channels to avoid fatigue."));

body.push(tableTitle("Table 5: 21-day multi-touch follow-up sequence"));
body.push(dataTable(
  ["Day", "Channel", "Action", "Message Focus"],
  [
    ["Day 0", "Email/LinkedIn", "First touch", "Problem + value + soft ask (profiles)"],
    ["Day 3", "LinkedIn", "Engage with their content (like/comment)", "Build visibility, no ask"],
    ["Day 5", "Email", "Follow-up 1 — value add", "Share a relevant insight/market update, restate ask"],
    ["Day 8", "WhatsApp", "Short voice note", "Human touch, check on openings"],
    ["Day 12", "Call", "Phone follow-up", "Direct ask for 15-min discovery"],
    ["Day 16", "Email", "Break-up email", "\"Should I close your file?\" — often gets a reply"],
    ["Day 21", "LinkedIn", "Soft reconnect", "Share success story / case study, leave door open"],
  ],
  [8, 15, 30, 47]
));
body.push(p("Log every touch in the CRM. A prospect who has received 7 touches and gone silent is moved to a quarterly nurture cadence, not abandoned — timing changes, and they may have an opening in 60 days."));

body.push(new Paragraph({ children: [new PageBreak()] }));

// ════════════════════════════════════════════════════════════
// CHAPTER 2: CANDIDATE ACQUISITION
// ════════════════════════════════════════════════════════════
body.push(h1("2. Candidate Acquisition"));
body.push(p("A staffing platform without candidates is an empty shop. The 30-day goal is to onboard 500+ verified imaging professionals across MRI, CT, X-Ray, and Cath Lab modalities. Candidate acquisition runs in parallel with hospital acquisition from Day 1, because having a populated talent pool is itself a sales asset — it lets you show pre-vetted profiles to hospitals immediately, shortening sales cycles."));

body.push(h2("2.1 Candidate Acquisition Channels"));
body.push(p("Five channels, in priority order, will deliver the 500-candidate target. The mix is deliberately weighted toward owned and community channels (which are free and durable) over paid channels (which drain budget quickly)."));

body.push(tableTitle("Table 6: Candidate acquisition channel mix and targets"));
body.push(dataTable(
  ["Channel", "Expected Yield (30 days)", "Cost", "Priority"],
  [
    ["College partnerships (B.Sc. MIT / radiology colleges)", "120-150", "Low (time only)", "1"],
    ["WhatsApp groups & community referrals", "150-200", "Free", "1"],
    ["LinkedIn sourcing (active & passive)", "100-130", "Free / low", "2"],
    ["Referral programme (existing candidates)", "60-80", "Moderate (incentives)", "2"],
    ["Job portals (Naukri/Shine/Indeed reposting)", "60-80", "Low", "3"],
  ],
  [40, 20, 20, 20]
));

body.push(h2("2.2 College Partnerships"));
body.push(p("Bangalore and Karnataka have a strong pipeline of B.Sc. Medical Imaging Technology (MIT) and radiology diploma graduates. Partnering with colleges gives HNVNS early access to fresh talent and positions the platform as a career-launching partner. The goal is to sign 3-5 college partnerships in 30 days."));

body.push(h3("Target colleges to approach"));
body.push(bullet("B.Sc. Medical Imaging Technology programmes across Bangalore (multiple colleges offer this — source via admission portals and the RGUHS affiliated college list)."));
body.push(bullet("Diploma in Radiology / Imaging colleges and paramedical training institutes."));
body.push(bullet("GE HealthCare's Radiology Technician (CT & MRI) capacity-building programme network in Bangalore as a partnership reference."));

body.push(h3("Partnership offer to colleges"));
body.push(pb("Placement assistance: ", "HNVNS becomes an official placement partner, connecting graduating students to hospital and diagnostic centre jobs — at no cost to the college."));
body.push(pb("Industry exposure: ", "The founder (senior radiology professor) offers guest lectures or workshops on imaging careers and AERB compliance — high value to colleges."));
body.push(pb("Alumni network access: ", "The college shares HNVNS registration links with alumni and final-year students via their placement cells and WhatsApp groups."));
body.push(pb("Feedback loop: ", "HNVNS shares market data on which skills are in demand, helping colleges tailor curriculum."));

body.push(h3("Execution steps"));
body.push(bullet("Identify placement officers / heads of radiology departments at 10 target colleges (Days 1-3)."));
body.push(bullet("Send a partnership proposal (1-page PDF) + request a 20-minute meeting (Days 4-10)."));
body.push(bullet("In meetings, offer the guest lecture as the hook and placement support as the value (Days 5-15)."));
body.push(bullet("Once partnered, share a registration form (the existing HNVNS candidate onboarding) with final-year students and alumni via WhatsApp broadcast (Days 10-30)."));

body.push(h2("2.3 WhatsApp Groups and Communities"));
body.push(p("WhatsApp is where radiology technologists already communicate. The strategy is to (a) join existing radiology/imaging technologist groups where permitted, (b) create and grow HNVNS-owned communities, and (c) use broadcast lists for job alerts. This is the highest-yield, lowest-cost channel."));

body.push(h3("WhatsApp group strategy"));
body.push(bulletBold("Join existing groups: ", "Search for and request to join radiology technologist WhatsApp/Facebook/Telegram communities. Many are city-based (Bangalore Radiology Techs) or modality-based (MRI Technologists India)."));
body.push(bulletBold("Create modality-specific HNVNS groups: ", "Launch 4 groups — \"MRI Tech Jobs Bangalore\", \"CT Tech Jobs Karnataka\", \"X-Ray & Cath Lab Jobs\", and \"Freshers - Radiology Careers\". Seed each with 5-10 known technologists."));
body.push(bulletBold("Post real jobs daily: ", "Even if anonymised hospital requirements, posting 1-2 job opportunities per day per group keeps the group alive and drives registrations."));
body.push(bulletBold("Add value beyond jobs: ", "Share AERB updates, certification info, salary benchmarks, and clinical tips. The founder's expertise makes these posts credible and shareable."));
body.push(bulletBold("Referral mechanics in groups: ", "Every member who refers a verified candidate who gets placed earns a referral bonus (see 2.5)."));

body.push(h2("2.4 LinkedIn Sourcing"));
body.push(p("LinkedIn is the richest source of experienced, passive imaging technologists. Many radiology professionals list \"MRI Technologist\", \"CT Radiographer\", or \"Radiologic Technologist\" in their titles. Use LinkedIn search (with filters for location = Karnataka, India, and title keywords) to build a sourcing list, then connect with a candidate-focused message."));

body.push(h3("Candidate connection request template"));
body.push(p("\"Hi [First Name], I lead HNVNS, a platform connecting MRI & CT technologists with verified hospital roles across Karnataka. I came across your profile and your experience at [current/past employer] looks strong. We have openings matching your profile — would you be open to a quick chat about opportunities?\""));

body.push(h3("LinkedIn sourcing workflow"));
body.push(bullet("Save 20 candidate profiles per day to a sourcing list (Days 2-30)."));
body.push(bullet("Send 10 personalised connection requests per day (cap to avoid LinkedIn limits)."));
body.push(bullet("On acceptance, share 1-2 relevant job openings and invite them to complete the HNVNS profile (the existing candidate onboarding form)."));
body.push(bullet("Tag accepted candidates in the CRM and move them through a candidate pipeline: Sourced > Connected > Profile Completed > Verified > Available."));

body.push(h2("2.5 Referral Programme"));
body.push(p("Referrals are the highest-quality and highest-converting candidate source. A technologist who refers a peer vouches for them, reducing screening burden and improving retention. Launch a structured referral programme in Week 2."));

body.push(tableTitle("Table 7: Referral incentive structure"));
body.push(dataTable(
  ["Referral Type", "Bonus to Referrer", "Bonus to Referred Candidate", "Condition"],
  [
    ["Verified candidate referral", "Rs. 500", "Rs. 500 (joining bonus)", "Candidate completes verification"],
    ["Successful placement referral", "Rs. 5,000 - 10,000", "—", "Referred candidate placed and completes 3 months"],
    ["Hospital referral (B2B)", "Rs. 10,000 credit", "—", "Referred hospital signs a placement"],
  ],
  [30, 25, 25, 20]
));

body.push(h2("2.6 Candidate Verification and Onboarding"));
body.push(p("Volume without quality is worthless — hospitals will not pay for unverified candidates, and a bad placement destroys trust. Every candidate must pass a lightweight verification before being added to the active pool. This is a core differentiator versus unstructured agencies."));

body.push(h3("Verification checklist (per candidate)"));
body.push(bullet("Identity proof (Aadhaar) and qualification certificates (B.Sc. MIT / diploma)."));
body.push(bullet("AERB registration / radiation safety certification status."));
body.push(bullet("Work experience verification (current and previous employer, modality, years)."));
body.push(bullet("Modality-specific skill self-assessment (MRI: 1.5T/3T, sequences; CT: multislice, contrast; Cath Lab: DSA experience)."));
body.push(bullet("Salary expectation and notice period / availability."));
body.push(bullet("Willingness to relocate within Karnataka / India."));

body.push(p("The existing HNVNS website candidate application flow and resume upload (already built and hardened) is the capture mechanism. Verification is done by the team (with intern support) within 48 hours of submission. Verified candidates are tagged and become immediately matchable to hospital requirements."));

body.push(new Paragraph({ children: [new PageBreak()] }));

// ════════════════════════════════════════════════════════════
// CHAPTER 3: DIGITAL MARKETING
// ════════════════════════════════════════════════════════════
body.push(h1("3. Digital Marketing"));
body.push(p("Digital marketing for HNVNS serves two audiences simultaneously: hospitals (demand side) and candidates (supply side). With a limited budget, the strategy prioritises organic channels — LinkedIn content, SEO, and local SEO — that compound over time, supplemented by Google Business Profile for local visibility. Paid ads are deferred until the website and funnel are conversion-optimised (Week 3-4)."));

body.push(h2("3.1 LinkedIn Content Calendar (30 Days)"));
body.push(p("LinkedIn is the primary content channel. The founder (senior radiology professor) is the voice — clinical credibility is the moat. Post 4-5 times per week on the founder profile and cross-post key content to the company page. Content pillars: (A) Industry insight / pain points, (B) Candidate spotlight / talent supply, (C) Hospital success / use cases, (D) Founder authority / radiology expertise, (E) Market data / benchmarks."));

body.push(tableTitle("Table 8: 30-day LinkedIn content calendar"));
body.push(dataTable(
  ["Day", "Pillar", "Post Topic / Hook"],
  [
    ["1", "D - Authority", "Why I'm building HNVNS after X years in radiology"],
    ["2", "A - Insight", "The hidden cost of scanner downtime (MRI idle = Rs.X/hour)"],
    ["3", "B - Candidate", "We just verified 5 MRI technologists — what we check"],
    ["4", "E - Data", "Karnataka needs N radiology techs; here's the gap"],
    ["5", "A - Insight", "Why hospitals can't find credentialed CT technologists"],
    ["6", "C - Success", "How a diagnostic centre filled an MRI role in 9 days"],
    ["7", "—", "Rest / engage only (comment on others' posts)"],
    ["8", "D - Authority", "AERB compliance: what every imaging hire must have"],
    ["9", "B - Candidate", "Meet a Cath Lab technologist (anonymised profile)"],
    ["10", "E - Data", "Salary benchmarks: MRI vs CT vs X-Ray tech in Bangalore"],
    ["11", "A - Insight", "Night-shift imaging staffing — the unsolved problem"],
    ["12", "C - Success", "Case study: retainer model vs per-placement"],
    ["13", "B - Candidate", "How our verification process works (behind the scenes)"],
    ["14", "—", "Rest / engage only"],
    ["15", "D - Authority", "3 things I look for in a great radiology technologist"],
    ["16", "A - Insight", "Why diagnostic chains churn techs (and how to fix it)"],
    ["17", "E - Data", "Where Karnataka's imaging talent is concentrated"],
    ["18", "C - Success", "Hospital testimonial / quote (if obtained)"],
    ["19", "B - Candidate", "Freshers vs experienced — what hospitals actually want"],
    ["20", "A - Insight", "The 48-hour staffing gap when a tech resigns"],
    ["21", "—", "Rest / engage only"],
    ["22", "D - Authority", "How AI is changing imaging (and staffing needs)"],
    ["23", "E - Data", "Time-to-fill: HNVNS vs market average"],
    ["24", "A - Insight", "Radiology attrition — root causes from the field"],
    ["25", "C - Success", "Month-1 recap: candidates onboarded, hospitals served"],
    ["26", "B - Candidate", "Referral programme launch announcement"],
    ["27", "D - Authority", "Building trust in healthcare staffing"],
    ["28", "E - Data", "Milestone: 500 verified candidates"],
    ["29", "A - Insight", "Forecast: imaging staffing demand next 12 months"],
    ["30", "C - Success", "30-day recap + what's next for HNVNS"],
  ],
  [8, 15, 77]
));

body.push(h2("3.2 SEO Strategy"));
body.push(p("SEO is a long-term asset that begins paying off in months 3-6 but must be started in Week 1. The strategy targets intent-driven keywords that hospitals and candidates search when they have an active need."));

body.push(h3("Keyword targeting (primary)"));
body.push(tableTitle("Table 9: Target keyword clusters"));
body.push(dataTable(
  ["Keyword Cluster", "Example Keywords", "Search Intent", "Funnel Stage"],
  [
    ["Radiology staffing", "radiology staffing Bangalore, radiology recruitment agency Karnataka", "Hospital looking for staff", "Bottom"],
    ["Technologist jobs", "MRI technologist jobs Bangalore, CT radiographer jobs Karnataka", "Candidate job hunting", "Bottom"],
    ["AERB / compliance", "AERB registration radiology, radiation safety certification India", "Informational / trust", "Mid"],
    ["Modality hiring", "hire MRI technologist, cath lab staffing India", "Hospital hiring", "Bottom"],
    ["Salary / career", "radiology technologist salary Bangalore, B.Sc MIT career scope", "Candidate research", "Top/Mid"],
  ],
  [22, 33, 25, 20]
));

body.push(h3("On-page SEO actions (Week 1)"));
body.push(bullet("Add unique meta titles and descriptions to every page (the current layout has metadata; ensure each route has a distinct, keyword-rich title)."));
body.push(bullet("Create dedicated landing pages for each modality: /staffing/mri-technologist, /staffing/ct-technologist, /staffing/x-ray-technologist, /staffing/cath-lab — each targeting its keyword cluster."));
body.push(bullet("Add structured data (JobPosting schema) to the existing jobs pages so they appear in Google for Jobs."));
body.push(bullet("Improve internal linking between insights posts and service/job pages."));
body.push(bullet("Submit and maintain an XML sitemap (already present as sitemap.xml route) and robots.txt."));

body.push(h2("3.3 Local SEO Strategy for Bangalore and Karnataka"));
body.push(p("Local SEO is critical because HNVNS is a location-specific service. Hospitals search \"radiology staffing near me\" or \"MRI technologist agency Bangalore\", and Google's local pack dominates these results."));

body.push(h3("Google Business Profile setup (Day 1-2, top priority)"));
body.push(bullet("Create and verify a Google Business Profile for HNVNS with the Bangalore address (or service-area business if no physical office)."));
body.push(bullet("Complete every field: categories (\"Medical staffing agency\", \"Recruiter\"), service area (Bangalore + Karnataka cities), hours, phone, website."));
body.push(bullet("Add photos: team, founder in clinical setting, logo."));
body.push(bullet("Write a keyword-rich business description mentioning radiology, imaging, MRI, CT, Bangalore, Karnataka."));
body.push(bullet("Collect reviews from early clients and partners — even 3-5 reviews dramatically improve local ranking."));

body.push(h3("Local SEO content"));
body.push(bullet("Create location pages: /bangalore, /karnataka with localised content (hospitals served, local market data)."));
body.push(bullet("Get listed on local directories: JustDial, Sulekha, IndiaMART (healthcare staffing category), Practo (where applicable)."));
body.push(bullet("Ensure NAP (Name, Address, Phone) consistency across web, GBP, and all directories."));

body.push(h2("3.4 Blog / Insights Content Strategy"));
body.push(p("The existing /insights section is the foundation. Content marketing serves SEO (top-of-funnel traffic) and authority (trust for sales conversations). Target 8 blog posts in 30 days (2 per week), each 800-1500 words, each targeting a primary keyword."));

body.push(tableTitle("Table 10: 30-day blog content plan"));
body.push(dataTable(
  ["Week", "Post 1 (Hospital-facing)", "Post 2 (Candidate-facing)"],
  [
    ["1", "Why radiology departments struggle to hire in Bangalore", "How to become an MRI technologist in Karnataka: complete guide"],
    ["2", "MRI vs CT technologist hiring: what hospitals get wrong", "AERB registration explained: what every radiology tech needs"],
    ["3", "The true cost of imaging staff attrition for hospitals", "Radiology technologist salary in Bangalore (2025 benchmarks)"],
    ["4", "How to staff a new MRI/CT scanner installation fast", "Top skills hospitals look for in Cath Lab technologists"],
  ],
  [10, 45, 45]
));

body.push(h2("3.5 Social Media Plan (Beyond LinkedIn)"));
body.push(pb("Instagram: ", "Lighter, visual content — day-in-the-life of a technologist, team photos, hospital spotlights. Aim for 3 posts/week. Useful for candidate (especially fresher) reach."));
body.push(pb("WhatsApp Status / broadcast: ", "Share job openings and milestones via broadcast lists to candidates and warm hospital contacts."));
body.push(pb("YouTube (optional, low priority): ", "Short videos from the founder on imaging topics — high authority signal if bandwidth allows; otherwise defer to month 2."));

body.push(new Paragraph({ children: [new PageBreak()] }));

// ════════════════════════════════════════════════════════════
// CHAPTER 4: COMPETITIVE ANALYSIS
// ════════════════════════════════════════════════════════════
body.push(h1("4. Competitive Analysis"));
body.push(p("The competitive landscape splits into two categories that HNVNS must position against differently: teleradiology platforms (a related but different category) and generalist healthcare staffing agencies (the direct competitors). Understanding both clarifies where HNVNS wins."));

body.push(h2("4.1 Competitor Categories"));

body.push(h3("Category A — Teleradiology platforms (indirect competitors)"));
body.push(p("Players like 5C Network operate AI-native teleradiology networks, reading 15,000+ scans daily for 2,000+ hospitals. Their model is remote reporting (radiologists), not on-site technologist staffing. They are not direct competitors for HNVNS's core service, but they signal the radiology market's growth and digital maturity, and they create relationships with hospital decision-makers. HNVNS can treat these platforms as potential referral partners (a hospital using 5C for reporting still needs on-site techs to operate scanners)."));

body.push(h3("Category B — Generalist healthcare staffing agencies (direct competitors)"));
body.push(p("Agencies such as Covenant Consultants (Bangalore, 23 years, 1,000+ clients), Shelby Global, TIGI HR, Alliance Recruitment, and Dynamic Consultation offer healthcare staffing as one of many verticals. They place doctors, nurses, and technicians across departments. Their weakness from HNVNS's perspective: they lack radiology-specific depth, credentialing expertise, and clinical credibility."));

body.push(tableTitle("Table 11: Competitor comparison"));
body.push(dataTable(
  ["Dimension", "5C Network (teleradiology)", "General Staffing Agencies", "HNVNS"],
  [
    ["Core service", "AI teleradiology reporting", "General healthcare staffing", "Specialist imaging technologist staffing"],
    ["Specialisation depth", "Deep (radiology reporting)", "Shallow (broad)", "Deep (imaging modalities only)"],
    ["Credential verification", "n/a (radiologists)", "Variable", "AERB + modality-specific verification"],
    ["Clinical credibility", "High", "Low", "Very high (founder = senior professor)"],
    ["Geographic focus", "Pan-India", "Varies", "Karnataka-first"],
    ["Pricing model", "Per-scan / subscription", "Per-placement / commission", "Flexible: per-placement + retainer"],
  ],
  [22, 22, 22, 34]
));

body.push(h2("4.2 Market Gaps HNVNS Exploits"));
body.push(pb("Specialisation gap: ", "No major competitor focuses exclusively on imaging technologists. Generalists treat radiology as a small slice; HNVNS makes it the whole pie. Specialists win on quality and speed."));
body.push(pb("Credentialing gap: ", "AERB compliance and modality-specific skill verification is rarely done rigorously by generalists. HNVNS's verification process is a defensible trust signal."));
body.push(pb("Clinical credibility gap: ", "A founder who is a senior radiology professor commands trust no generalist recruiter can. Hospitals prefer to source from a peer."));
body.push(pb("Local depth gap: ", "Pan-India agencies under-serve Karnataka at a granular level. HNVNS's Bangalore-Karnataka focus builds deeper local networks of both hospitals and candidates."));
body.push(pb("Speed gap: ", "Generalist agencies are slow (weeks). A pre-verified candidate pool lets HNVNS promise profiles in 48 hours."));

body.push(h2("4.3 Differentiation Strategy"));
body.push(p("HNVNS's positioning statement: \"India's specialist radiology workforce platform — credential-verified imaging talent, sourced by radiologists, for radiology departments.\" Every message, page, and pitch reinforces three differentiators: (1) imaging-only specialisation, (2) rigorous credential verification, (3) founder-led clinical credibility. This triangulation is hard to copy: agencies can claim specialisation, but they cannot manufacture a senior radiology professor founder."));

body.push(h3("Defensive moats to build during the 30 days"));
body.push(bullet("Candidate pool depth: 500 verified candidates is a moat — competitors must start from scratch."));
body.push(bullet("Hospital relationships: founder-network relationships convert and compound."));
body.push(bullet("Trust assets: verification process, AERB expertise, published salary benchmarks and insights."));
body.push(bullet("Community: owned WhatsApp groups create a switching cost for candidates."));

body.push(new Paragraph({ children: [new PageBreak()] }));

// ════════════════════════════════════════════════════════════
// CHAPTER 5: SALES SYSTEM
// ════════════════════════════════════════════════════════════
body.push(h1("5. Sales System"));
body.push(p("Discipline beats hustle. A CRM-backed sales system ensures no lead is lost, every conversation is tracked, and the team can measure what works. Set this up in Week 1 before outreach volume increases."));

body.push(h2("5.1 CRM Setup"));
body.push(pb("Tool: ", "HubSpot Free CRM (or Zoho CRM Free). Both are free, integrate with email and WhatsApp via Zapier, and scale to paid tiers later. HubSpot is recommended for its email tracking and meeting scheduler."));
body.push(pb("What to configure on Day 1-2: ", "Company account, custom properties (hospital tier, modality needs, candidate verification status), email integration, pipeline stages, and deal stages."));

body.push(h2("5.2 Pipeline Stages"));
body.push(p("Define a clear pipeline so every prospect has a known status. The hospital pipeline has 7 stages; the candidate pipeline has 5."));

body.push(tableTitle("Table 12: Hospital sales pipeline"));
body.push(dataTable(
  ["Stage", "Definition", "Action to Advance"],
  [
    ["1. Lead", "Identified account + decision-maker contact info", "Send first touch (email/LinkedIn)"],
    ["2. Contacted", "First outreach sent, awaiting response", "Follow-up sequence"],
    ["3. Engaged", "Replied / accepted / had a conversation", "Book discovery call"],
    ["4. Qualified", "Discovery call done; confirmed need + budget", "Send proposal / candidate profiles"],
    ["5. Proposal", "Pricing shared, candidate profiles sent", "Negotiate, address objections"],
    ["6. Closed-Won", "Agreement signed / pilot started", "Begin fulfilment"],
    ["7. Closed-Lost / Nurture", "No current need or lost", "Move to quarterly nurture"],
  ],
  [18, 42, 40]
));

body.push(tableTitle("Table 13: Candidate pipeline"));
body.push(dataTable(
  ["Stage", "Definition", "Action to Advance"],
  [
    ["1. Sourced", "Profile identified (LinkedIn/referral/group)", "Send connection / registration link"],
    ["2. Registered", "Completed HNVNS application form", "Begin verification"],
    ["3. Verified", "Documents + skills checked, tagged active", "Match to hospital requirements"],
    ["4. Matched/Interviewing", "Profile sent to hospital, interview scheduled", "Support interview + negotiation"],
    ["5. Placed", "Offer accepted, joined", "Follow up at 30/60/90 days"],
  ],
  [22, 43, 35]
));

body.push(h2("5.3 Lead Tracking"));
body.push(bullet("Every contact (email, call, LinkedIn, WhatsApp) logged in CRM with date, channel, and outcome."));
body.push(bullet("Custom fields: hospital name, modality needs (MRI/CT/X-Ray/Cath Lab), number of open roles, urgency, decision-maker name and role."));
body.push(bullet("Source tracking: where did the lead come from? (LinkedIn, referral, website, cold email, event)."));
body.push(bullet("Next-step field: every open deal must have a scheduled next action — if \"next step\" is blank, the deal is stale."));

body.push(h2("5.4 KPIs and Daily Activity Targets"));
body.push(p("Measure leading indicators (activity) and lagging indicators (results). Leading indicators predict results 2-4 weeks ahead; track them daily."));

body.push(tableTitle("Table 14: KPI dashboard"));
body.push(dataTable(
  ["KPI", "Type", "Daily Target", "Weekly Target"],
  [
    ["New prospects contacted", "Leading", "30", "150"],
    ["Discovery calls booked", "Leading", "1-2", "5-10"],
    ["Candidate profiles registered", "Leading", "15", "75"],
    ["Candidates verified", "Leading", "10", "50"],
    ["CRM activities logged", "Leading", "40+", "200+"],
    ["Meetings held", "Lagging", "—", "3-5"],
    ["Proposals sent", "Lagging", "—", "2-3"],
    ["Pipeline value (INR)", "Lagging", "—", "Grow weekly"],
    ["Placements", "Lagging", "—", "0-1 (ramps over weeks)"],
  ],
  [35, 18, 17, 30]
));

body.push(h2("5.5 Weekly Review Process"));
body.push(p("Every Monday morning (09:00-10:00), hold a 60-minute weekly review with the full team. The review is data-driven and forward-looking."));

body.push(h3("Weekly review agenda"));
body.push(bullet("Review last week's KPIs vs targets (the dashboard above). Identify gaps."));
body.push(bullet("Pipeline review: walk every deal in stage 4+ (Qualified and beyond). What is the next step? What is blocking it?"));
body.push(bullet("Candidate pool review: how many verified candidates? Any stuck in verification?"));
body.push(bullet("Set the week's top 3 priorities and daily activity targets."));
body.push(bullet("Capture learnings: what messaging worked? What objections came up? Update scripts."));
body.push(bullet("Review cash: any placements invoiced? Any receivables due?"));

body.push(new Paragraph({ children: [new PageBreak()] }));

// ════════════════════════════════════════════════════════════
// CHAPTER 6: REVENUE PLAN
// ════════════════════════════════════════════════════════════
body.push(h1("6. Revenue Plan"));
body.push(p("The revenue plan defines how HNVNS makes money, what to charge, and the path to break-even. Two models operate in parallel: a per-placement fee (transactional) and a monthly retainer (recurring). The retainer model is preferred for predictability, but per-placement is easier to sell first."));

body.push(h2("6.1 Pricing Models"));

body.push(h3("Model A — Per-placement fee (primary, launch model)"));
body.push(p("Charge a one-time fee per successfully placed candidate, due after the candidate joins and completes a guarantee period (typically 30-90 days). This is the industry-standard model and easiest for hospitals to say yes to because there is no upfront risk."));

body.push(tableTitle("Table 15: Recommended per-placement fees (Karnataka market)"));
body.push(dataTable(
  ["Role", "Candidate Experience", "Recommended Fee", "Rationale"],
  [
    ["MRI Technologist", "0-2 yrs (fresher)", "Rs. 25,000 - 40,000", "Lower fee, higher volume"],
    ["MRI Technologist", "3-7 yrs", "Rs. 50,000 - 75,000", "Core revenue tier"],
    ["MRI Technologist", "8+ yrs (senior/lead)", "Rs. 80,000 - 1,20,000", "Hard to find, premium"],
    ["CT Technologist", "All levels", "Rs. 30,000 - 70,000", "Similar to MRI, slightly lower"],
    ["X-Ray Technologist", "All levels", "Rs. 20,000 - 40,000", "More abundant, lower fee"],
    ["Cath Lab Technologist", "All levels", "Rs. 60,000 - 1,00,000", "Specialist, scarce, premium"],
    ["Radiology Department Staffing (multi-role)", "Bundle", "Rs. 1,00,000+ (negotiated)", "Volume deal"],
  ],
  [25, 20, 25, 30]
));

body.push(h3("Model B — Monthly retainer (recurring, target for steady clients)"));
body.push(p("Charge a fixed monthly fee for guaranteed access to a candidate pipeline, priority fulfilment, and a set number of guaranteed placements or profiles per month. Best for hospitals with ongoing hiring needs (large hospitals, diagnostic chains, healthcare groups)."));

body.push(tableTitle("Table 16: Retainer tiers"));
body.push(dataTable(
  ["Tier", "Monthly Fee", "Includes", "Target Client"],
  [
    ["Starter", "Rs. 25,000 / month", "Up to 2 placements/month, 48-hr profiles", "Single hospital, occasional hiring"],
    ["Growth", "Rs. 50,000 / month", "Up to 4 placements/month, dedicated SPOC, priority", "Mid-size hospital, regular hiring"],
    ["Enterprise", "Rs. 1,00,000+ / month", "Unlimited profiles, department staffing, SLA", "Hospital group / diagnostic chain"],
  ],
  [15, 20, 45, 20]
));

body.push(h3("Pricing rules"));
body.push(bullet("Always offer a free-replacement guarantee (30-90 days) — reduces buyer risk and is standard practice."));
body.push(bullet("Negotiate on volume: a hospital committing to 3+ placements gets 10-15% off."));
body.push(bullet("Never undercut to win a logo — it trains clients to expect low prices and is hard to reverse."));

body.push(h2("6.2 First-Month Revenue Targets"));
body.push(p("Be realistic: in the first month, most hospital conversations are still in the pipeline (hospital sales cycles are 4-12 weeks). The first revenue likely comes from 1-2 fast placements at smaller diagnostic centres or through founder-network warm deals."));

body.push(tableTitle("Table 17: Month-1 revenue scenarios"));
body.push(dataTable(
  ["Scenario", "Placements", "Avg Fee", "Retainer Signed", "Month-1 Revenue"],
  [
    ["Conservative", "1", "Rs. 50,000", "0", "Rs. 50,000"],
    ["Base case", "1-2", "Rs. 60,000", "1 starter (pro-rated)", "Rs. 1,50,000 - 2,00,000"],
    ["Stretch", "3", "Rs. 70,000", "1 growth", "Rs. 3,50,000 - 4,50,000"],
  ],
  [20, 15, 20, 25, 20]
));

body.push(h2("6.3 Break-Even Analysis"));
body.push(p("Break-even is the point where monthly revenue covers monthly operating costs. With a lean team (founders + interns) and low fixed costs, break-even is achievable quickly."));

body.push(tableTitle("Table 18: Estimated monthly operating costs"));
body.push(dataTable(
  ["Cost Item", "Monthly Cost (INR)", "Notes"],
  [
    ["Tooling (CRM, email, hosting, domains)", "5,000 - 10,000", "Mostly free tiers initially"],
    ["Intern stipends (2-3 interns)", "15,000 - 30,000", "Performance-based"],
    ["Marketing (content, ads — minimal)", "5,000 - 15,000", "Mostly organic in month 1"],
    ["Referral payouts", "5,000 - 15,000", "Variable, success-based"],
    ["Communications / travel / misc", "5,000 - 10,000", ""],
    ["Total monthly fixed + variable", "35,000 - 80,000", ""],
  ],
  [40, 25, 35]
));

body.push(pb("Break-even point: ", "Approximately 1-2 placements per month at average fees, or one Starter retainer. This is reachable by month 2-3 if pipeline-building in month 1 is executed well."));
body.push(pb("Path to profitability: ", "By month 4-6, target 5-10 placements/month + 2-3 retainers = Rs. 3-6 lakh/month revenue against Rs. 80,000-1,50,000 costs (with a small paid hire), yielding healthy margins."));

body.push(new Paragraph({ children: [new PageBreak()] }));

// ════════════════════════════════════════════════════════════
// CHAPTER 7: WEBSITE OPTIMIZATION
// ════════════════════════════════════════════════════════════
body.push(h1("7. Website Optimization"));
body.push(p("The current HNVNS website (hnvns-radiology.vercel.app) is a solid Next.js foundation with a professional dark theme, existing sections (hero, value prop, hospital trust strip, pricing, blog preview, CTA), and working flows (job detail pages, candidate application with resume upload, dashboard, admin). The optimisation focus is on conversion, trust, and SEO — not redesign. No existing UI, styling, or copy should change; the work is additive."));

body.push(h2("7.1 Missing Pages to Add"));
body.push(tableTitle("Table 19: Recommended new pages"));
body.push(dataTable(
  ["Page / Route", "Purpose", "Priority"],
  [
    ["/staffing/mri-technologist", "SEO landing for MRI staffing keyword", "High"],
    ["/staffing/ct-technologist", "SEO landing for CT staffing keyword", "High"],
    ["/staffing/x-ray-technologist", "SEO landing for X-Ray staffing keyword", "High"],
    ["/staffing/cath-lab-technologist", "SEO landing for Cath Lab staffing keyword", "High"],
    ["/case-studies (or /success-stories)", "Trust-building proof of placements", "High"],
    ["/team", "Founder/team credibility (clinical authority)", "Medium"],
    ["/faq", "Reduce sales friction, SEO long-tail", "Medium"],
    ["/bangalore, /karnataka", "Local SEO landing pages", "Medium"],
    ["/privacy, /terms", "Compliance & trust (essential for B2B)", "High"],
  ],
  [40, 45, 15]
));

body.push(h2("7.2 Trust-Building Elements to Add"));
body.push(p("Trust is the #1 conversion lever in B2B healthcare. The site has trust strips and badges; deepen them with concrete proof."));
body.push(bulletBold("Real testimonials: ", "Even 2-3 short quotes from early hospital contacts or placed candidates, with name + role + hospital, dramatically lift conversion. Add a dedicated testimonials block on the homepage and hospitals page."));
body.push(bulletBold("Case studies: ", "A structured case study page (Problem > Approach > Result with metrics like time-to-fill) for the first successful placement."));
body.push(bulletBold("Founder authority block: ", "On the about/team page, surface the founder's radiology professor credentials, years of experience, and institutions — this is the core moat and must be visible."));
body.push(bulletBold("Compliance badges: ", "Mention AERB awareness, data handling, and candidate verification process prominently on the hospitals page."));
body.push(bulletBold("Logos of hospitals engaged: ", "If any hospital (even unpaid pilot) agrees, show their logo. Social proof scales trust."));

body.push(h2("7.3 Conversion Optimization"));
body.push(pb("Clear primary CTA everywhere: ", "Every page should have one obvious next action for hospitals (\"Request staffing\" / \"Talk to us\") and one for candidates (\"View open roles\" / \"Submit your profile\"). Reduce choice overload."));
body.push(pb("Lead capture forms: ", "The contact and hospitals pages already capture requirements; ensure the form is short (3-5 fields) and the submit button has a benefit-oriented label (\"Get vetted candidates in 48 hours\")."));
body.push(pb("Above-the-fold clarity: ", "Ensure the homepage hero states what HNVNS does and for whom in one sentence. If a hospital visitor can't tell within 5 seconds, they leave."));
body.push(pb("WhatsApp / call CTA: ", "Add a floating WhatsApp button and a clickable phone number — Indian B2B buyers prefer instant channels."));
body.push(pb("Speed: ", "The site is fast (Next.js, static). Maintain this — Core Web Vitals affect both SEO and conversion."));

body.push(h2("7.4 SEO Improvements"));
body.push(bullet("Distinct, keyword-rich metadata per route (currently some pages share generic titles)."));
body.push(bullet("JobPosting structured data on /jobs/[id] for Google for Jobs inclusion."));
body.push(bullet("Breadcrumb structured data for sitelinks."));
body.push(bullet("Internal linking from insights posts to service/staffing pages."));
body.push(bullet("Image alt text on all images."));
body.push(bullet("Canonical tags to prevent duplicate-content issues."));
body.push(bullet("Open Graph images per page for link previews on LinkedIn/WhatsApp."));

body.push(h2("7.5 Lead Generation Improvements"));
body.push(pb("Lead magnet: ", "Offer a free downloadable resource (e.g., \"Karnataka Radiology Staffing Salary Report 2025\" or \"AERB Compliance Checklist for Imaging Departments\") in exchange for email. Captures hospital leads who aren't ready to talk yet."));
body.push(pb("Exit-intent / scroll capture: ", "A subtle \"Talk to us about your imaging staffing\" prompt for hospital visitors after 60 seconds or 50% scroll."));
body.push(pb("Newsletter sign-up: ", "Build an email list from the insights section for nurture."));

body.push(new Paragraph({ children: [new PageBreak()] }));

// ════════════════════════════════════════════════════════════
// CHAPTER 8: HIRING PLAN
// ════════════════════════════════════════════════════════════
body.push(h1("8. Hiring Plan"));
body.push(p("To scale outreach and candidate verification beyond what the founders can do alone, hire 2-3 interns in Week 1. Interns multiply effort at low cost and can be converted to full-time hires as revenue grows. The roles are designed for fresh graduates or students who are hungry, articulate, and comfortable with phone/WhatsApp outreach."));

body.push(h2("8.1 Intern Roles and Count"));
body.push(tableTitle("Table 20: Intern hiring plan"));
body.push(dataTable(
  ["Role", "Count", "Focus", "Profile"],
  [
    ["Candidate Sourcing & Verification Intern", "1-2", "LinkedIn sourcing, WhatsApp groups, document verification, candidate CRM updates", "B.Sc./B.Com graduate, detail-oriented, comfortable with calls"],
    ["Hospital Outreach Intern (SDR)", "1", "Prospect research, LinkedIn/email outreach support, call follow-ups, CRM logging", "Confident communicator, English + Kannada, sales aptitude"],
    ["Content / Social Media Intern (optional)", "0-1", "LinkedIn posts drafting, blog support, basic graphics, community management", "Good writer, marketing interest"],
  ],
  [35, 10, 35, 20]
));

body.push(h2("8.2 Internship Job Descriptions"));

body.push(h3("Candidate Sourcing & Verification Intern"));
body.push(pb("Role: ", "Source, contact, and verify radiology technologist candidates to grow HNVNS's talent pool to 500+ verified professionals."));
body.push(pb("Responsibilities: ", "Source candidates on LinkedIn and job portals; manage WhatsApp communities; collect and verify documents (ID, qualifications, AERB); update candidate records in CRM; coordinate referrals."));
body.push(pb("Requirements: ", "Graduate (any discipline); fluent English + Kannada; detail-oriented; comfortable on phone/WhatsApp; basic LinkedIn and spreadsheet skills."));

body.push(h3("Hospital Outreach Intern (Sales Development Representative)"));
body.push(pb("Role: ", "Support founder-led hospital acquisition through prospect research, outreach, and pipeline management."));
body.push(pb("Responsibilities: ", "Build and maintain the target account list; research decision-makers; send LinkedIn and email outreach under guidance; make follow-up calls; log all activity in CRM; schedule discovery calls."));
body.push(pb("Requirements: ", "Confident communicator; English + Kannada; interest in sales/business development; organised and persistent; healthcare interest a plus."));

body.push(h2("8.3 Incentive Structures"));
body.push(p("Interns receive a modest fixed stipend plus performance incentives aligned to outcomes. This keeps fixed cost low while driving results."));
body.push(tableTitle("Table 21: Intern compensation"));
body.push(dataTable(
  ["Role", "Monthly Stipend", "Performance Incentive", "Conversion Path"],
  [
    ["Sourcing & Verification Intern", "Rs. 8,000 - 12,000", "Rs. 50 per verified candidate (target: 50/month)", "Full-time Talent Ops role after 3 months if targets met"],
    ["Hospital Outreach SDR", "Rs. 10,000 - 15,000", "Rs. 1,000 per qualified meeting booked + 1% of closed deal", "Full-time Sales Associate after 3 months"],
    ["Content Intern", "Rs. 6,000 - 10,000", "Rs. 300 per published post that hits engagement threshold", "Part-time / freelance continuation"],
  ],
  [30, 22, 33, 15]
));

body.push(h2("8.4 Performance Tracking"));
body.push(bullet("Weekly KPI review per intern (sourcing count, verification throughput, outreach volume, meetings booked)."));
body.push(bullet("30-day evaluation: interns meeting 70%+ of targets are offered extension/conversion."));
body.push(bullet("Clear daily activity logs in the CRM — transparency builds accountability."));

body.push(new Paragraph({ children: [new PageBreak()] }));

// ════════════════════════════════════════════════════════════
// CHAPTER 9: AUTOMATION
// ════════════════════════════════════════════════════════════
body.push(h1("9. Automation"));
body.push(p("Automation multiplies a small team's output. The principle is: automate repetitive, rules-based work; keep humans on relationships and judgment. Implement the highest-ROI automations in Weeks 2-3 once manual processes are proven."));

body.push(h2("9.1 CRM Automation"));
body.push(bulletBold("Email tracking + logging: ", "Connect email to HubSpot so every email to a prospect auto-logs in the CRM — no manual entry."));
body.push(bulletBold("Pipeline stage automation: ", "Auto-move deals based on triggers (e.g., \"meeting booked\" → move to Qualified; \"proposal sent\" email detected → move to Proposal)."));
body.push(bulletBold("Task reminders: ", "Auto-create follow-up tasks when a prospect goes X days without a response."));
body.push(bulletBold("Lead scoring: ", "Auto-score leads by engagement (email opens, site visits, form fills) so the team focuses on the hottest."));

body.push(h2("9.2 Lead Generation Automation"));
body.push(bulletBold("LinkedIn automation (cautiously): ", "Use a tool like Expandi, HeyReach, or LinkedHelper for connection-request campaigns at safe limits (20-30/day). Never spam — always personalise. Risk: LinkedIn restrictions; mitigate with conservative limits and human oversight."));
body.push(bulletBold("Website chatbot: ", "Add a simple chatbot (Tawk.to free, or Crisp) on the site to capture hospital inquiries 24/7 and qualify (\"Are you a hospital or a candidate?\") before routing to WhatsApp."));
body.push(bulletBold("Google Alerts / mention tracking: ", "Set alerts for \"new MRI installation Bangalore\", hospital expansion news, and competitor mentions — early signals for outreach."));

body.push(h2("9.3 Candidate Screening Automation"));
body.push(bulletBold("Automated application intake: ", "The existing candidate application flow already captures structured data. Add automated validation (required fields, file type checks — already present via the hardened upload route)."));
body.push(bulletBold("AI-assisted screening: ", "Use an LLM (via API) to extract structured data from uploaded resumes — modality, years, certifications, employer history — and pre-fill the candidate record. Flag missing AERB/cert info automatically. This cuts verification time by 60-80%."));
body.push(bulletBold("Automated verification reminders: ", "WhatsApp/email auto-reminders to candidates who submitted incomplete documents."));
body.push(bulletBold("Skill self-assessment form: ", "Automated form that scores candidates on modality-specific skills and tags them in the CRM."));

body.push(h2("9.4 Email and WhatsApp Automation"));
body.push(bulletBold("Drip sequences: ", "Pre-built email sequences for hospital prospects (the 21-day sequence from Chapter 1) triggered automatically when a lead enters \"Contacted\" stage."));
body.push(bulletBold("Candidate nurture: ", "Automated WhatsApp broadcasts to verified candidates with new job openings matching their tags."));
body.push(bulletBold("WhatsApp Business API: ", "Use the WhatsApp Business API (via a provider like WATI, Interakt, or AiSensy) for broadcast lists, automated replies, and template messages at scale. Essential once candidate pool exceeds 200."));
body.push(bulletBold("Meeting scheduling: ", "HubSpot/Calendly meeting link in every email signature so prospects book directly — eliminates back-and-forth."));

body.push(h2("9.5 AI Tools (Practical Stack)"));
body.push(tableTitle("Table 22: Recommended AI tools"));
body.push(dataTable(
  ["Use Case", "Tool", "Purpose"],
  [
    ["Resume parsing / candidate data extraction", "OpenAI GPT-4o-mini API or Claude API", "Extract modality, years, certs from resumes"],
    ["Email/LinkedIn message drafting", "ChatGPT / Claude", "Draft personalised outreach at scale"],
    ["Content writing (blog, LinkedIn)", "ChatGPT / Claude + human edit", "Draft posts and articles"],
    ["Transcription (call notes)", "Otter.ai / Fireflies.ai", "Auto-transcribe discovery calls, extract action items"],
    ["Design (social graphics)", "Canva (AI features)", "Quick graphics for posts"],
    ["CRM + email + chatbot", "HubSpot Free", "Integrated automation"],
  ],
  [40, 25, 35]
));

body.push(new Paragraph({ children: [new PageBreak()] }));

// ════════════════════════════════════════════════════════════
// CHAPTER 10: EXECUTION ROADMAP (DAY-BY-DAY)
// ════════════════════════════════════════════════════════════
body.push(h1("10. Execution Roadmap (Day-by-Day)"));
body.push(p("This is the operational core of the plan — exact actions for each of the 30 days, grouped into 4 weeks. Each week has a theme, daily actions, and expected outcomes. Priority order is embedded: Week 1 builds infrastructure; Weeks 2-4 scale outreach and conversion."));

body.push(h2("Week 1 (Days 1-7): Foundation & Infrastructure"));
body.push(p("Theme: Set up every system before scaling outreach. By end of Week 1, the CRM, tracking, LinkedIn presence, Google Business Profile, and target account list are in place."));

body.push(tableTitle("Table 23: Week 1 daily plan"));
body.push(dataTable(
  ["Day", "Primary Actions", "Expected Outcome"],
  [
    ["1", "Set up HubSpot CRM (account, pipeline stages, custom fields). Optimise founder LinkedIn profile. Build target account list (first 50). Create Google Business Profile.", "CRM live; profile optimised; 50 accounts listed"],
    ["2", "Complete target account list to 100. Research decision-makers for top 40 (Tier 1). Draft outreach templates (email, LinkedIn, call). Write first LinkedIn post.", "100 accounts; templates ready; first post live"],
    ["3", "Begin outreach: 20 LinkedIn connections, 10 cold emails to Tier 1. Publish blog post 1. Set up email tracking. Begin candidate sourcing (20 profiles).", "30 contacts; first blog live; sourcing started"],
    ["4", "Continue outreach (30 contacts). Launch first WhatsApp group (MRI Tech Jobs Bangalore, seed with 10 known techs). Begin intern interviews.", "30 more contacts; 1 group live; interview pipeline"],
    ["5", "Outreach (30 contacts). First discovery calls (warm network). Approve/shortlist interns. Refine messaging based on early responses.", "30 contacts; 1-2 calls; interns shortlisted"],
    ["6", "Lighter day: engage on LinkedIn (comment on 10 posts), follow up warm leads, review week's metrics. Publish blog post 2 (candidate-facing).", "Engagement boost; 2nd blog live"],
    ["7", "Weekly review (KPIs, pipeline, learnings). Plan Week 2. Onboard selected interns. Update CRM with all data.", "Week 1 review done; interns onboarded"],
  ],
  [6, 64, 30]
));

body.push(h2("Week 2 (Days 8-14): Outreach Velocity & Candidate Build"));
body.push(p("Theme: Ramp outreach to full daily volume with intern support. Begin college partnership outreach. Grow candidate pool aggressively."));

body.push(tableTitle("Table 24: Week 2 daily plan"));
body.push(dataTable(
  ["Day", "Primary Actions", "Expected Outcome"],
  [
    ["8", "Full outreach (30 contacts, intern-supported). Begin college partnership outreach (5 colleges). LinkedIn post. Launch referral programme.", "30 contacts; 5 colleges approached; referral live"],
    ["9", "Outreach (30). Discovery calls (2-3). Source 20 candidates. Verify 10. Intern training on verification process.", "30 contacts; candidates verified"],
    ["10", "Outreach (30). Publish blog post 3. Second WhatsApp group (CT Tech Jobs). First college meeting (if secured).", "30 contacts; 2nd group; blog 3"],
    ["11", "Outreach (30). Send first candidate profiles to engaged hospitals. Continue verification.", "30 contacts; profiles sent"],
    ["12", "Outreach (30). Discovery calls. Publish LinkedIn post. Reach out to 5 more colleges.", "30 contacts; more colleges"],
    ["13", "Lighter day: LinkedIn engagement, candidate follow-ups, group value posts (AERB info). Publish blog post 4.", "Engagement; blog 4"],
    ["14", "Weekly review. Aim: 100+ verified candidates by now. Plan Week 3.", "100 candidates milestone; review done"],
  ],
  [6, 64, 30]
));

body.push(h2("Week 3 (Days 15-21): Conversion & Pilots"));
body.push(p("Theme: Convert pipeline to pilots/placements. Push proposals. Aim for first signed client and first placement in progress. Begin automation rollout."));

body.push(tableTitle("Table 25: Week 3 daily plan"));
body.push(dataTable(
  ["Day", "Primary Actions", "Expected Outcome"],
  [
    ["15", "Outreach (30). Send proposals to qualified hospitals (target 3 proposals). Set up email automation (drip sequences). LinkedIn post.", "3 proposals sent; automation live"],
    ["16", "Outreach (30). Negotiate/close warm deals. Source + verify candidates. Publish blog post 5.", "30 contacts; blog 5"],
    ["17", "Outreach (30). Discovery calls. Launch WhatsApp Business API (if pool >150). Third group (X-Ray/Cath Lab).", "30 contacts; API live; 3rd group"],
    ["18", "Outreach (30). Push for first signed client/pilot. LinkedIn post. Begin website SEO additions (staffing landing pages).", "Pilot discussions advanced"],
    ["19", "Outreach (30). Discovery calls. Publish blog post 6. Refine pricing based on feedback.", "30 contacts; blog 6"],
    ["20", "Lighter day: LinkedIn engagement, candidate matching to live requirements, group value content. Publish blog post 7.", "Engagement; blog 7"],
    ["21", "Weekly review. Aim: 1 signed/piloting client, 250+ verified candidates. Plan Week 4.", "1 client; 250 candidates; review"],
  ],
  [6, 64, 30]
));

body.push(h2("Week 4 (Days 22-28): Scale & Systematise"));
body.push(p("Theme: Cement the first revenue, systematise processes, and set up for month 2. Continue full outreach volume."));

body.push(tableTitle("Table 26: Week 4 daily plan"));
body.push(dataTable(
  ["Day", "Primary Actions", "Expected Outcome"],
  [
    ["22", "Outreach (30). First placement in progress (target). LinkedIn post. Begin candidate referral payouts.", "Placement in progress"],
    ["23", "Outreach (30). Discovery calls. Publish blog post 8. Finalise case study content (if placement done).", "30 contacts; blog 8"],
    ["24", "Outreach (30). Push second client to close. Verify candidates toward 500 target. LinkedIn post.", "30 contacts; 2nd client advancing"],
    ["25", "Outreach (30). Discovery calls. Add website trust elements (testimonials, case study page).", "30 contacts; trust elements live"],
    ["26", "Outreach (30). Publish LinkedIn post. College partnership sign-ups (aim 3 signed).", "30 contacts; colleges signed"],
    ["27", "Lighter day: LinkedIn engagement, group management, candidate follow-ups.", "Engagement"],
    ["28", "Weekly review. Aim: 500 verified candidates, 3 clients (signed/piloting).", "500 candidates; 3 clients; review"],
  ],
  [6, 64, 30]
));

body.push(h2("Days 29-30: Close-Out & Month-2 Planning"));
body.push(tableTitle("Table 27: Final 2 days"));
body.push(dataTable(
  ["Day", "Primary Actions", "Expected Outcome"],
  [
    ["29", "Final outreach push. Collect testimonials/case study data. LinkedIn post (milestone). Reconcile revenue.", "Testimonials collected; revenue reconciled"],
    ["30", "Full 30-day review: KPIs vs targets, what worked, what to fix. Build Month-2 plan. Celebrate wins.", "Month-1 report; Month-2 plan ready"],
  ],
  [6, 64, 30]
));

body.push(h2("10.1 Priority Order (If Time is Short)"));
body.push(p("If bandwidth is constrained, execute in this strict priority order — these are the highest-leverage actions:"));
body.push(bullet("Founder-network warm outreach to Tier 1 hospitals (highest conversion)."));
body.push(bullet("Google Business Profile setup (fastest local SEO win)."));
body.push(bullet("Founder LinkedIn profile optimisation + daily posting."));
body.push(bullet("CRM setup + disciplined daily outreach logging."));
body.push(bullet("WhatsApp group launch + candidate sourcing."));
body.push(bullet("College partnership outreach (guest lecture as hook)."));
body.push(bullet("Website trust elements + staffing landing pages."));

body.push(h2("10.2 Risks and Mitigation"));
body.push(tableTitle("Table 28: Key risks and mitigations"));
body.push(dataTable(
  ["Risk", "Likelihood", "Impact", "Mitigation"],
  [
    ["Long hospital procurement cycles delay first revenue", "High", "High", "Prioritise smaller diagnostic centres (faster decisions); offer pilot/no-risk trial; build pipeline depth so some deals always close"],
    ["Candidate quality varies; bad placement damages trust", "Medium", "High", "Rigorous verification; free-replacement guarantee; never place unverified candidates"],
    ["Competitors (established agencies) undercut on price", "Medium", "Medium", "Compete on specialisation + speed + clinical credibility, not price; avoid race to bottom"],
    ["Intern underperformance / attrition", "Medium", "Low", "Clear KPIs, weekly reviews, performance incentives, over-hire by 1"],
    ["LinkedIn restrictions from automation", "Low", "Medium", "Conservative limits (20-30/day), human personalisation, never bulk generic"],
    ["Founder bandwidth overload (sales + ops + clinical)", "High", "High", "Delegate verification + sourcing to interns Day 1; protect founder time for highest-value relationships"],
    ["Low website conversion (traffic doesn't convert)", "Medium", "Medium", "Add WhatsApp CTA, lead magnet, testimonials; A/B test forms"],
    ["Cash flow gap before revenue lands", "Medium", "High", "Keep fixed costs minimal; pursue retainers (upfront cash); have 3-month runway buffer"],
  ],
  [30, 12, 12, 46]
));

body.push(new Paragraph({ children: [new PageBreak()] }));

// ════════════════════════════════════════════════════════════
// CLOSING
// ════════════════════════════════════════════════════════════
body.push(h1("Closing Note"));
body.push(p("This plan is built to be executed, not just read. The single most important behaviour is daily, disciplined outreach — 30 contacts every working day, logged in the CRM, followed up relentlessly. Compounding works: 600 contacts over 30 days, of which 10-15% engage and a fraction convert, will produce the first paying clients and a candidate pool that becomes a durable competitive moat."));
body.push(p("HNVNS's unfair advantages are real and hard to replicate: a senior radiology professor founder with deep hospital relationships, a practising radiologist co-founder, and the clinical credibility that no generalist staffing agency can manufacture. The 30 days are about converting those advantages into a pipeline, a productised service, and the first revenue that funds everything that comes next."));
body.push(p("Review progress against the KPI dashboard weekly. Adjust tactics, not strategy. Protect the founder's time for relationships. Move fast on candidates and hospitals that show intent. The plan is ambitious but achievable — execute it with focus and the targets in Table 1 are within reach."));

// ──────────────────────────────────────────────────────────────
// ASSEMBLE DOCUMENT
// ──────────────────────────────────────────────────────────────
const coverConfig = {
  title: "HNVNS 30-Day Execution Plan",
  subtitle: "Complete Growth Strategy for Karnataka's Specialist Radiology Staffing Platform",
  englishLabel: "STRATEGIC PLAN",
  metaLines: [
    "Prepared for: HNVNS Founding Team",
    "Focus: Hospital & Candidate Acquisition, Bangalore - Karnataka",
    "Version: 1.0",
  ],
  footerLeft: "HNVNS Radiology",
  footerRight: "Confidential - Internal Use",
};

const tocChildren = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 480, after: 360 },
    children: [new TextRun({
      text: "Table of Contents",
      bold: true, size: 32,
      font: { ascii: "Calibri", eastAsia: "SimHei" },
      color: P.bodyPrimary,
    })],
  }),
  new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
  new Paragraph({
    spacing: { before: 200 },
    children: [new TextRun({
      text: "Note: This Table of Contents is generated via field codes. To ensure page number accuracy after editing, please right-click the TOC and select \"Update Field.\"",
      italics: true, size: 18, color: "888888",
    })],
  }),
  new Paragraph({ children: [new PageBreak()] }),
];

const doc = new Document({
  creator: "HNVNS",
  title: "HNVNS 30-Day Execution Plan",
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, size: 22, color: P.bodyText },
        paragraph: { spacing: { line: 312 } },
      },
      heading1: {
        run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 32, bold: true, color: P.bodyPrimary },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 },
      },
      heading2: {
        run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 28, bold: true, color: P.bodyPrimary },
        paragraph: { spacing: { before: 300, after: 140 }, outlineLevel: 1 },
      },
      heading3: {
        run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 25, bold: true, color: P.bodyPrimary },
        paragraph: { spacing: { before: 220, after: 100 }, outlineLevel: 2 },
      },
    },
  },
  sections: [
    // Section 1: Cover
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: buildCover(coverConfig),
    },
    // Section 2: Front matter (TOC) — Roman numerals
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN },
        },
      },
      footers: { default: footerRoman() },
      children: tocChildren,
    },
    // Section 3: Body — Arabic numerals from 1
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      footers: { default: footerArabic() },
      children: body,
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  const outPath = "HNVNS_30_Day_Execution_Plan.docx";
  fs.writeFileSync(outPath, buf);
  console.log("Generated: " + outPath);
});
