// offerTemplate.ts — Configurable Offer Letter Template
// Quiclogix Solutions — Public Internship Application System
//
// NOTE FOR OWNER:
// The fields below contain official placeholders pending your authorization.
// Update company details, signatory, and dates when ratified.
// Do NOT invent unauthorized official claims or addresses.

export interface OfferLetterData {
  candidateName: string;
  referenceId: string;
  domainName: string;
  selectionDate: string;
  cohortName?: string;
  duration?: string;
}

export function generateOfferLetterHtml(data: OfferLetterData): string {
  const cohort = data.cohortName || 'Upcoming Engineering Intake (To be confirmed)';
  const duration = data.duration || '4 Weeks (1 Month Milestone Sprint)';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Internship Offer Letter — ${data.referenceId}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 48px;
      color: #111613;
      background: #ffffff;
      line-height: 1.6;
    }
    .header {
      border-bottom: 2px solid #D8B437;
      padding-bottom: 24px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 700;
      color: #111613;
      letter-spacing: -0.02em;
    }
    .logo-text span {
      color: #7A5B00;
    }
    .meta-col {
      text-align: right;
      font-size: 12px;
      color: #59675F;
    }
    .ref-badge {
      font-family: monospace;
      font-size: 13px;
      font-weight: bold;
      color: #7A5B00;
      background: #F8F6F1;
      padding: 4px 8px;
      border: 1px solid #E0DAD0;
      border-radius: 4px;
      display: inline-block;
      margin-top: 4px;
    }
    .title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #111613;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .greeting {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    p {
      font-size: 14px;
      margin-bottom: 14px;
      color: #333333;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
    }
    .details-table td {
      padding: 10px 14px;
      border: 1px solid #E0DAD0;
      font-size: 13px;
    }
    .details-table td.label {
      font-weight: 600;
      background: #F8F6F1;
      width: 35%;
      color: #111613;
    }
    .details-table td.value {
      color: #111613;
      font-family: monospace;
    }
    .notice-box {
      background: #F8F6F1;
      border-left: 4px solid #D8B437;
      padding: 14px 18px;
      font-size: 12px;
      color: #59675F;
      margin: 24px 0;
    }
    .footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #E0DAD0;
      font-size: 12px;
      color: #59675F;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo-text">QUICLOGIX <span>SOLUTIONS</span></div>
      <div style="font-size: 12px; color: #59675F; margin-top: 4px;">Technology Consulting & Engineering Mentorship Platform</div>
    </div>
    <div class="meta-col">
      <div>Date: ${data.selectionDate}</div>
      <div class="ref-badge">${data.referenceId}</div>
    </div>
  </div>

  <div class="title">Letter of Internship Selection</div>

  <div class="greeting">Dear ${data.candidateName},</div>

  <p>
    Following an objective technical review of your candidate application, we are pleased to inform you that you have been <strong>Selected</strong> for the Quiclogix Solutions Internship Program.
  </p>

  <table class="details-table">
    <tr>
      <td class="label">Candidate Name</td>
      <td class="value">${data.candidateName}</td>
    </tr>
    <tr>
      <td class="label">Reference ID</td>
      <td class="value">${data.referenceId}</td>
    </tr>
    <tr>
      <td class="label">Selected Track</td>
      <td class="value">${data.domainName}</td>
    </tr>
    <tr>
      <td class="label">Program Duration</td>
      <td class="value">${duration}</td>
    </tr>
    <tr>
      <td class="label">Cohort Cycle</td>
      <td class="value">${cohort}</td>
    </tr>
  </table>

  <p>
    During this program, you will work on milestone-driven engineering briefs designed around real-world software architecture standards. You will be evaluated objectively against industrial rubrics covering code architecture, correctness, and technical documentation.
  </p>

  <div class="notice-box" style="background: #f0fdf4; border-left: 4px solid #22c55e; color: #166534; padding: 16px 20px;">
    <strong style="color: #14532d; font-size: 13px; text-transform: uppercase;">⚠️ Mandatory Cohort Onboarding Action:</strong>
    <p style="margin: 8px 0 12px 0; font-size: 13px; color: #166534;">
      All sprint milestones, project briefings, daily syncs, and mentor guidance are coordinated strictly through the official WhatsApp group. Joining is mandatory for all selected interns.
    </p>
    <a href="https://chat.whatsapp.com/DrRIcLb9LXfIdSd1WDiFX6?mode=gi_t" target="_blank" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 13px;">
      📲 Join Official Interns WhatsApp Group
    </a>
  </div>

  <p>
    We welcome you to Quiclogix Solutions and look forward to your contributions.
  </p>

  <div class="footer">
    <div>
      <strong>Quiclogix Solutions Technical Review Panel</strong><br>
      Admissions & Engineering Mentorship Division
    </div>
    <div style="text-align: right;">
      Official Verification Portal: https://quiclogix.com/#verify<br>
      Reference ID: ${data.referenceId}
    </div>
  </div>
</body>
</html>`;
}
