import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

type DayKey = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
type LocationKey = 'KATY' | 'SUGARLAND';

type RegistrationPayload = {
  studentName: string;
  age: number;
  parentName: string;
  phone: string;
  email: string;
  location: LocationKey;
  frequency: 'ONCE_A_WEEK' | 'TWICE_A_WEEK';
  selectedDays: DayKey[];
  startDate: string; // ISO
  liabilityAccepted: boolean;
  paymentMethod: 'Cash' | 'Zelle' | 'Check' | string;
  waiverSignature?: { name?: string; address?: string };
};

const resend = new Resend(process.env.RESEND_API_KEY);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

const baseWrap = (inner: string) => `
  <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
              max-width:620px;margin:0 auto;background:#fff;border-radius:12px;
              border:1px solid #f7d4e1;overflow:hidden">
    <div style="background:#ffe9f2;padding:18px 22px">
      <img alt="Baila Kids" src="https://via.placeholder.co/160x36?text=Baila+Kids" style="display:block;height:36px"/>
    </div>
    <div style="padding:22px">
      ${inner}
    </div>
    <div style="padding:14px 22px;background:#fff6fa;color:#9a3a60;font-size:12px;text-align:center">
      © ${new Date().getFullYear()} Baila Kids
    </div>
  </div>
`;

const registrantHTML = (p: RegistrationPayload) => baseWrap(`
  <h2 style="color:#d61f69;margin:0 0 8px">🎉 Registration received!</h2>
  <p style="margin:0 0 12px;color:#333">
    Hi ${p.parentName}, thanks for registering <strong>${p.studentName}</strong>.
    We’re excited to see you on <strong>${fmtDate(p.startDate)}</strong>.
  </p>

  <table style="width:100%;border-collapse:collapse;margin-top:12px">
    <thead>
      <tr style="background:#fff6fa">
        <th style="text-align:left;padding:10px;font-size:13px;color:#6b1f44">Detail</th>
        <th style="text-align:left;padding:10px;font-size:13px;color:#6b1f44">Info</th>
      </tr>
    </thead>
    <tbody style="font-size:14px;color:#333">
      <tr><td style="padding:8px 10px">Student</td><td style="padding:8px 10px">${p.studentName} (Age ${p.age})</td></tr>
      <tr><td style="padding:8px 10px">Parent/Guardian</td><td style="padding:8px 10px">${p.parentName}</td></tr>
      <tr><td style="padding:8px 10px">Phone</td><td style="padding:8px 10px">${p.phone}</td></tr>
      <tr><td style="padding:8px 10px">Email</td><td style="padding:8px 10px">${p.email}</td></tr>
      <tr><td style="padding:8px 10px">Location</td><td style="padding:8px 10px">${p.location}</td></tr>
      <tr><td style="padding:8px 10px">Frequency</td><td style="padding:8px 10px">${p.frequency === 'ONCE_A_WEEK' ? 'Once a week' : 'Twice a week'}</td></tr>
      <tr><td style="padding:8px 10px">Day(s)</td><td style="padding:8px 10px">${p.selectedDays.join(', ')}</td></tr>
      <tr><td style="padding:8px 10px">Start date</td><td style="padding:8px 10px">${fmtDate(p.startDate)}</td></tr>
      <tr><td style="padding:8px 10px">Payment method</td><td style="padding:8px 10px">${p.paymentMethod}</td></tr>
    </tbody>
  </table>

  <p style="margin-top:16px;color:#555">
    Questions or changes? Just reply to this email and we’ll help.
  </p>
`);

const ownerHTML = (p: RegistrationPayload) => baseWrap(`
  <h3 style="color:#b11656;margin:0 0 12px">🗂️ New Registration</h3>

  <table style="width:100%;border-collapse:collapse">
    <tbody style="font-size:14px;color:#222">
      <tr><td style="padding:8px 10px;width:160px;color:#6b1f44">Student</td><td style="padding:8px 10px"><strong>${p.studentName}</strong> (Age ${p.age})</td></tr>
      <tr><td style="padding:8px 10px;color:#6b1f44">Parent</td><td style="padding:8px 10px">${p.parentName}</td></tr>
      <tr><td style="padding:8px 10px;color:#6b1f44">Contact</td><td style="padding:8px 10px">${p.phone} • ${p.email}</td></tr>
      <tr><td style="padding:8px 10px;color:#6b1f44">Location</td><td style="padding:8px 10px">${p.location}</td></tr>
      <tr><td style="padding:8px 10px;color:#6b1f44">Frequency</td><td style="padding:8px 10px">${p.frequency === 'ONCE_A_WEEK' ? 'Once a week' : 'Twice a week'}</td></tr>
      <tr><td style="padding:8px 10px;color:#6b1f44">Day(s)</td><td style="padding:8px 10px">${p.selectedDays.join(', ')}</td></tr>
      <tr><td style="padding:8px 10px;color:#6b1f44">Start</td><td style="padding:8px 10px">${fmtDate(p.startDate)}</td></tr>
      <tr><td style="padding:8px 10px;color:#6b1f44">Payment</td><td style="padding:8px 10px">${p.paymentMethod}</td></tr>
    </tbody>
  </table>

  <p style="margin-top:12px;font-size:13px;color:#666">
    Tip: mark as PAID in the Admin dashboard after confirming payment.
  </p>
`);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });

  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
    console.error('Missing RESEND_API_KEY or FROM_EMAIL');
    return res.status(500).json({ success: false, error: 'Email not configured' });
  }

  try {
    const p = req.body as RegistrationPayload;

    const [toUser, toOwner] = await Promise.all([
      resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: p.email,
        replyTo: ['cristinapantin@yahoo.com'],
        subject: `Baila Kids – Registration received for ${p.studentName}`,
        html: registrantHTML(p),
        text: `Registration received for ${p.studentName} (Age ${p.age}) — start ${fmtDate(p.startDate)}.`
      }),
      resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: 'cristinapantin@yahoo.com',
        subject: `New Registration – ${p.studentName} (${p.location}, ${p.selectedDays.join('/')})`,
        html: ownerHTML(p),
        text: [
          `New Registration`,
          `Student: ${p.studentName} (Age ${p.age})`,
          `Parent: ${p.parentName}`,
          `Contact: ${p.phone} / ${p.email}`,
          `Location: ${p.location}`,
          `Frequency: ${p.frequency === 'ONCE_A_WEEK' ? 'Once a week' : 'Twice a week'}`,
          `Days: ${p.selectedDays.join(', ')}`,
          `Start: ${fmtDate(p.startDate)}`,
          `Payment: ${p.paymentMethod}`
        ].join('\n')
      })
    ]);

    // Simple failure check
    if ((toUser as any)?.error || (toOwner as any)?.error) {
      console.error('Resend error(s):', (toUser as any)?.error, (toOwner as any)?.error);
      return res.status(500).json({ success: false, error: 'Email send failed' });
    }

    return res.status(200).json({ success: true });
  } catch (e: any) {
    console.error('sendConfirmation error:', { name: e?.name, message: e?.message, raw: e });
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
