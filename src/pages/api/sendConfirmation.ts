import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

type DayKey = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

type CityKey = 'HOUSTON' | 'DALLAS';

type SchoolKey =
  | 'KATY'
  | 'SUGARLAND'
  | 'ALLEN'
  | 'FRISCO'
  | 'CASTLE_HILLS'
  | 'NORTH_DALLAS'
  | 'PRESTON_TRAIL';

const CITY_LABELS: Record<CityKey, string> = {
  HOUSTON: 'Houston',
  DALLAS: 'Dallas',
};

const SCHOOL_LABELS: Record<SchoolKey, string> = {
  KATY: 'Katy',
  SUGARLAND: 'Sugar Land',
  ALLEN: 'Allen',
  FRISCO: 'Frisco',
  CASTLE_HILLS: 'Castle Hills',
  NORTH_DALLAS: 'North Dallas',
  PRESTON_TRAIL: 'Preston Trail',
};

type RegistrationPayload = {
  studentName: string;
  age: number;
  parentName: string;
  phone: string;
  email: string;
  city: CityKey;
  school: SchoolKey;
  frequency: 'ONCE_A_WEEK' | 'TWICE_A_WEEK';
  selectedDays: DayKey[];
  startDate: string;
  liabilityAccepted: boolean;
  paymentMethod: 'Cash' | 'Zelle' | 'Check';
  waiverSignature?: { name?: string; address?: string };
};

type ApiResp = { success: boolean; error?: string };

const resend = new Resend(process.env.RESEND_API_KEY);

function ordinal(n: number) {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;

  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

function formatReadableDateYMDWithWeekday(
  ymd: string,
  timeZone = 'America/Chicago',
) {
  const [year, month, day] = ymd.split('-').map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + 1));

  const weekday = utc.toLocaleDateString('en-US', {
    weekday: 'long',
    timeZone,
  });

  const monthName = utc.toLocaleDateString('en-US', {
    month: 'long',
    timeZone,
  });

  return `${weekday}, ${monthName} ${ordinal(day)}, ${year}`;
}

const detailRow = (label: string, value: string) => `
  <tr>
    <td style="padding:0 0 14px;vertical-align:top">
      <div style="font-size:12px;line-height:1.3;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#9a3a60;margin-bottom:4px">
        ${label}
      </div>
      <div style="font-size:16px;line-height:1.45;color:#33252b">
        ${value}
      </div>
    </td>
  </tr>
`;

const sectionHeading = (text: string) => `
  <h3 style="margin:28px 0 14px;font-size:18px;line-height:1.3;color:#b11656">
    ${text}
  </h3>
`;

const baseWrap = (inner: string) => `
  <!doctype html>
  <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Baila Kids</title>
    </head>

    <body style="margin:0;padding:0;background:#fff8fb">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">
        Baila Kids registration confirmation
      </div>

      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="width:100%;background:#fff8fb;margin:0;padding:0"
      >
        <tr>
          <td align="center" style="padding:18px 10px">
            <table
              role="presentation"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              border="0"
              style="width:100%;max-width:620px;background:#ffffff;border:1px solid #f4cbdc;border-radius:16px;overflow:hidden"
            >
              <tr>
                <td align="center" style="background:#ff4d91;padding:22px 18px">
                  <img
                    alt="Baila Kids"
                    src="https://www.bailakids.org/bailakids/logo.png"
                    width="250"
                    style="display:block;width:100%;max-width:250px;height:auto;margin:0 auto;border:0"
                  />
                </td>
              </tr>

              <tr>
                <td style="padding:26px 22px 30px">
                  ${inner}
                </td>
              </tr>

              <tr>
                <td style="padding:13px 20px;background:#fff2f7;color:#9a3a60;font-size:11px;line-height:1.4;text-align:center">
                  © ${new Date().getFullYear()} Baila Kids
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

const paymentHTML = (p: RegistrationPayload, formattedDate: string) => {
  let instructions = '';

  if (p.paymentMethod === 'Zelle') {
    instructions = `
      <p style="margin:10px 0 0;font-size:15px;line-height:1.6;color:#4b3941">
        Send payment via Zelle to
        <strong style="color:#b11656">bailakidsdance@gmail.com</strong>.
        Please include your child's name in the payment memo.
      </p>
    `;
  }

  if (p.paymentMethod === 'Cash') {
    instructions = `
      <p style="margin:10px 0 0;font-size:15px;line-height:1.6;color:#4b3941">
        Please complete payment before the first day of classes,
        <strong>${formattedDate}</strong>.
        Place the payment in an envelope labeled with the student's name and
        drop it off at the Spanish Schoolhouse front office.
      </p>
    `;
  }

  if (p.paymentMethod === 'Check') {
    instructions = `
      <p style="margin:10px 0 0;font-size:15px;line-height:1.6;color:#4b3941">
        Please complete payment before the first day of classes,
        <strong>${formattedDate}</strong>.
        Make checks payable to <strong>Baila Kids LLC</strong>, place the check
        in an envelope labeled with the student's name, and drop it off at the
        Spanish Schoolhouse front office.
      </p>
    `;
  }

  return `
    <div style="margin-top:26px;padding:18px;background:#fff2f7;border:1px solid #f5c9da;border-radius:12px">
      <div style="font-size:12px;line-height:1.3;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#9a3a60">
        Payment Method
      </div>
      <div style="margin-top:5px;font-size:20px;line-height:1.3;font-weight:700;color:#b11656">
        ${p.paymentMethod}
      </div>
      ${instructions}
    </div>
  `;
};

const registrantHTML = (p: RegistrationPayload) => {
  const formattedDate = formatReadableDateYMDWithWeekday(p.startDate);
  const cityLabel = CITY_LABELS[p.city];
  const schoolLabel = SCHOOL_LABELS[p.school];
  const frequencyLabel =
    p.frequency === 'ONCE_A_WEEK' ? 'Once a week' : 'Twice a week';
  const daysLabel = p.selectedDays.join(' and ');

  return baseWrap(`
    <h1 style="margin:0;text-align:center;font-size:27px;line-height:1.2;color:#c51c61">
      Registration Confirmed
    </h1>

    <p style="margin:12px 0 0;text-align:center;font-size:16px;line-height:1.55;color:#554149">
      Hi ${p.parentName}, thank you for registering
      <strong>${p.studentName}</strong> with Baila Kids.
    </p>

    <div style="margin:24px 0 6px;padding:20px 16px;text-align:center;background:#fff2f7;border:1px solid #f5c9da;border-radius:12px">
      <div style="font-size:12px;line-height:1.3;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#9a3a60">
        First Class
      </div>
      <div style="margin-top:7px;font-size:22px;line-height:1.35;font-weight:700;color:#b11656">
        ${formattedDate}
      </div>
      <div style="margin-top:6px;font-size:15px;line-height:1.45;color:#634b55">
        ${schoolLabel}, ${cityLabel}
      </div>
    </div>

    ${sectionHeading('Student Information')}

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      ${detailRow('Student', `${p.studentName} (Age ${p.age})`)}
      ${detailRow('Parent / Guardian', p.parentName)}
      ${detailRow('Phone', p.phone)}
      ${detailRow('Email', p.email)}
    </table>

    <div style="height:1px;background:#f2dbe4;margin:6px 0 0"></div>

    ${sectionHeading('Class Information')}

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      ${detailRow('Location', `${schoolLabel}<br /><span style="color:#6b5660">${cityLabel}</span>`)}
      ${detailRow('Frequency', frequencyLabel)}
      ${detailRow(p.selectedDays.length === 1 ? 'Class Day' : 'Class Days', daysLabel)}
    </table>

    ${paymentHTML(p, formattedDate)}

    <div style="margin-top:28px;padding-top:22px;border-top:1px solid #f2dbe4">
      <p style="margin:0;font-size:15px;line-height:1.65;color:#554149">
        You're all set. We'll email you again before classes begin with any
        additional information and reminders.
      </p>

      <p style="margin:16px 0 0;font-size:14px;line-height:1.65;color:#6b5660">
        Questions? Reply to this email, email
        <strong style="color:#b11656">bailakidsdance@gmail.com</strong>, or text
        <strong style="color:#b11656">(281) 658-1140</strong>. Please include the
        student's name in your message.
      </p>
    </div>
  `);
};

const ownerHTML = (p: RegistrationPayload) => {
  const formattedDate = formatReadableDateYMDWithWeekday(p.startDate);
  const cityLabel = CITY_LABELS[p.city];
  const schoolLabel = SCHOOL_LABELS[p.school];
  const frequencyLabel =
    p.frequency === 'ONCE_A_WEEK' ? 'Once a week' : 'Twice a week';

  return baseWrap(`
    <h1 style="margin:0 0 20px;font-size:25px;line-height:1.2;color:#b11656">
      New Registration
    </h1>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      ${detailRow('Student', `${p.studentName} (Age ${p.age})`)}
      ${detailRow('Parent / Guardian', p.parentName)}
      ${detailRow('Phone', p.phone)}
      ${detailRow('Email', p.email)}
      ${detailRow('Location', `${schoolLabel}, ${cityLabel}`)}
      ${detailRow('Frequency', frequencyLabel)}
      ${detailRow(p.selectedDays.length === 1 ? 'Class Day' : 'Class Days', p.selectedDays.join(' and '))}
      ${detailRow('First Class', formattedDate)}
      ${detailRow('Payment Method', p.paymentMethod)}
    </table>

    ${
      p.paymentMethod === 'Zelle'
        ? `
          <div style="margin-top:8px;padding:14px;background:#fff2f7;border:1px solid #f5c9da;border-radius:10px;font-size:14px;line-height:1.5;color:#604b54">
            Zelle instructions were included in the parent's confirmation email.
          </div>
        `
        : ''
    }
  `);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResp>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  }

  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
    console.error('Missing RESEND_API_KEY or FROM_EMAIL');

    return res.status(500).json({
      success: false,
      error: 'Email not configured',
    });
  }

  try {
    const p: RegistrationPayload = req.body;

    const [toUser, toOwner] = await Promise.all([
      resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: p.email,
        replyTo: ['cristinapantin@yahoo.com'],
        subject: `Baila Kids – Registration confirmed for ${p.studentName}`,
        html: registrantHTML(p),
      }),

      resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: 'cristinapantin@yahoo.com',
        subject: `New Registration – ${p.studentName} (${SCHOOL_LABELS[p.school]})`,
        html: ownerHTML(p),
      }),
    ]);

    if (toUser.error || toOwner.error) {
      console.error('Resend error(s):', toUser.error, toOwner.error);

      return res.status(500).json({
        success: false,
        error: 'Email send failed',
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('sendConfirmation error:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
}