import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

type LocationKey = 'KATY' | 'SUGARLAND';
type DayKey = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';

type RegistrationPayload = {
  studentName: string;
  age: number;
  parentName: string;
  phone: string;
  email: string;
  location: LocationKey;
  frequency: 'ONCE_A_WEEK' | 'TWICE_A_WEEK';
  selectedDays: DayKey[];
  startDate: string; // now always "YYYY-MM-DD"
  liabilityAccepted: boolean;
  paymentMethod: 'Cash' | 'Zelle' | 'Check';
  waiverSignature?: { name?: string; address?: string };
};

type ApiResp = { success: boolean; error?: string };

const resend = new Resend(process.env.RESEND_API_KEY);

function ordinal(n: number) {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

function formatReadableDateYMDWithWeekday(ymd: string, timeZone = 'America/Chicago') {
  const [y, m, d] = ymd.split('-').map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d + 1));
  const weekday = utc.toLocaleDateString('en-US', { weekday: 'long', timeZone });
  const month = utc.toLocaleDateString('en-US', { month: 'long', timeZone });
  return `${weekday}, ${month} ${ordinal(d)}, ${y}`;
}

const baseWrap = (inner: string) => `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:620px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #f7d4e1;overflow:hidden">
    <div style="background:#ff4d91;padding:18px 22px;text-align:center">
    <img
      alt="Baila Kids"
      src="https://www.bailakids.org/bailakids/logo.png"
      style="display:block;height:40%;margin:0 auto"
    />

    </div>
    <div style="padding:22px">
      ${inner}
    </div>
    <div style="padding:14px 22px;background:#fff6fa;color:#9a3a60;font-size:12px;text-align:center">
      © ${new Date().getFullYear()} Baila Kids
    </div>
  </div>
`;

const registrantHTML = (p: RegistrationPayload) => {
  const formattedDate = formatReadableDateYMDWithWeekday(p.startDate);
  return baseWrap(`
    <h2 style="color:#d61f69;margin:0 0 8px">🎉 Registration received!</h2>
    <p>Hi ${p.parentName}, thanks for registering <strong>${p.studentName}</strong>.
       We’re excited to see you on <strong>${formattedDate}</strong>.</p>
    <ul style="line-height:1.5">
      <li>Student: ${p.studentName} (Age ${p.age})</li>
      <li>Parent/Guardian: ${p.parentName}</li>
      <li>Phone: ${p.phone}</li>
      <li>Email: ${p.email}</li>
      <li>Location: ${p.location}</li>
      <li>Frequency: ${p.frequency === 'ONCE_A_WEEK' ? 'Once a week' : 'Twice a week'}</li>
      <li>Day(s): ${p.selectedDays.join(', ')}</li>
      <li>
          Payment method: ${p.paymentMethod}
          ${p.paymentMethod === 'Zelle'
            ? `<br/><strong>Zelle Instructions:</strong> Send payment to <strong>bailakidsdance@gmail.com</strong> via Zelle. Include your child's name in the subject line.`
            : ''
          }
          ${p.paymentMethod === 'Cash'
            ? `<br/><strong>Please make sure payment is complete before the first day of classes (${p.startDate})</strong>
                <br/><strong>Please drop off payments in an envelope to the Spanish Schoolhouse front office</strong>`
            : ''
          }
          ${p.paymentMethod === 'Check'
            ? `<br/><strong>Please make sure payment is complete before the first day of classes (${p.startDate})</strong>
                <br/>Make checks payable to <strong>Baila Kids LLC</strong>
                <br/><strong>Please drop off payments in an envelope to the Spanish Schoolhouse front office</strong>`

            : ''
          }
      </li>
    </ul>
    <p style="margin-top:20px;color:#555;font-size:14px;line-height:1.4">
      We’ll be reaching out with more details about your classes very soon. Have any questions? Please email <strong>bailakidsdance@gmail.com</strong> or text <strong>(281) 658-1140</strong> and include the student's name in the subject line.
      In the meantime, keep an eye on your inbox — we can’t wait to dance with you!
    </p>
  `);
};

const ownerHTML = (p: RegistrationPayload) => {
  const formattedDate = formatReadableDateYMDWithWeekday(p.startDate);
  return baseWrap(`
    <h3 style="color:#b11656;margin:0 0 12px">🗂️ New Registration</h3>
    <ul style="line-height:1.5">
      <li>Student: ${p.studentName} (Age ${p.age})</li>
      <li>Parent: ${p.parentName}</li>
      <li>Contact: ${p.phone} • ${p.email}</li>
      <li>Location: ${p.location}</li>
      <li>Frequency: ${p.frequency === 'ONCE_A_WEEK' ? 'Once a week' : 'Twice a week'}</li>
      <li>Day(s): ${p.selectedDays.join(', ')}</li>
      <li>Start: ${formattedDate}</li>
      <li>
        Payment: ${p.paymentMethod}
        ${p.paymentMethod === 'Zelle'
          ? ` – Instructions sent to parent in their confirmation email`
          : ''
        }
      </li>
    </ul>
  `);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResp>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
    console.error('Missing RESEND_API_KEY or FROM_EMAIL');
    return res.status(500).json({ success: false, error: 'Email not configured' });
  }

  try {
    const p: RegistrationPayload = req.body;

    const [toUser, toOwner] = await Promise.all([
      resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: p.email,
        replyTo: ['cristinapantin@yahoo.com'],
        subject: `Baila Kids – Registration received for ${p.studentName}`,
        html: registrantHTML(p),
      }),
      resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: 'cristinapantin@yahoo.com',
        subject: `New Registration – ${p.studentName} (${p.location})`,
        html: ownerHTML(p),
      }),
    ]);

    if (toUser.error || toOwner.error) {
      console.error('Resend error(s):', toUser.error, toOwner.error);
      return res.status(500).json({ success: false, error: 'Email send failed' });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('sendConfirmation error:', e);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
