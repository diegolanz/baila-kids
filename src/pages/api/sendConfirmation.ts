import { Resend } from 'resend';
import type { NextApiRequest, NextApiResponse } from 'next';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    studentName,
    parentName,
    age,
    phone,
    email,
    location,
    frequency,
    selectedDays,
    paymentMethod,
  } = req.body;

  const message = `
    <h2>New Registration for Baila Kids</h2>
    <p><strong>Student:</strong> ${studentName} (${age} years old)</p>
    <p><strong>Parent:</strong> ${parentName}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Location:</strong> ${location}</p>
    <p><strong>Frequency:</strong> ${frequency}</p>
    <p><strong>Days:</strong> ${selectedDays.join(', ')}</p>
    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
  `;

  try {
    const response = await resend.emails.send({
      from: 'Baila Kids <registration@bailakids.org>',
      to: ["diegolanz0412@gmail.com"],
      subject: 'Baila Kids Registration Confirmation',
      html: message,
    });


    console.log('Resend response:', response);

    if (response?.data?.id) {
      return res.status(200).json({ success: true });
    } else {
      console.error('Resend error:', response.error);
      throw new Error('Resend did not return a message ID.');
    }
  } catch (error: unknown) {
    console.error('Email send error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ success: false, error: errorMessage });
  }
}
