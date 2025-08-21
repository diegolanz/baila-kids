// pages/api/waitlist.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // adjust path if different

type Resp = { success: true } | { success: false; error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Resp>) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });

  try {
    const {
      studentName, age, parentName, phone, email,
      location, requestedDay, notes
    } = req.body as {
      studentName: string; age: number; parentName: string; phone: string; email: string;
      location: 'KATY' | 'SUGARLAND'; requestedDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
      notes?: string;
    };

    // very light validation
    if (!studentName || !parentName || !phone || !email || !location || !requestedDay) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }

    await prisma.waitingList.create({
      data: { studentName, age, parentName, phone, email, location, requestedDay, notes }
    });

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('waitlist error', e);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}
