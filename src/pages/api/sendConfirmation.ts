import type { NextApiRequest, NextApiResponse } from 'next';
// Resend example; adjust to your actual email provider setup.
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type ApiResp = { success: boolean; error?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResp>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const {
      email,
      studentName,
      location,
      frequency,
      selectedDays,
      startDate,
      paymentMethod,
    } = req.body as {
      email: string;
      studentName?: string;
      location?: string;
      frequency?: string;
      selectedDays?: string[];
      startDate?: string;
      paymentMethod?: string;
    };

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    if (!resend) {
      console.warn('RESEND_API_KEY not set; skipping email send.');
      return res.status(200).json({ success: true }); // Don’t block the UX if email isn’t configured
    }

    const html = `
      <h2>Baila Kids Registration Confirmation</h2>
      <p>Thank you for registering${studentName ? `, ${studentName}` : ''}!</p>
      <p><strong>Location:</strong> ${location ?? ''}</p>
      <p><strong>Frequency:</strong> ${frequency ?? ''}</p>
      <p><strong>Selected days:</strong> ${(selectedDays ?? []).join(', ')}</p>
      <p><strong>First class:</strong> ${startDate ?? ''}</p>
      <p><strong>Payment method:</strong> ${paymentMethod ?? ''}</p>
    `;

    await resend.emails.send({
      from: 'Baila Kids <registration@bailakids.org>', 
      to: email,
      subject: 'Your Baila Kids Registration',
      html,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('SendConfirmation API error:', err);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
