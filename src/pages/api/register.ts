import type { NextApiRequest, NextApiResponse } from 'next';
// If you have a Prisma client, import it. Adjust path to your setup.
import prisma from '@/lib/prisma'; // <-- change this import if your prisma client lives elsewhere

type ApiResp = { success: boolean; error?: string };

type ReqBody = {
  studentName: string;
  age: number;
  parentName: string;
  phone: string;
  email: string;
  location: 'KATY' | 'SUGARLAND';
  frequency: 'ONCE_A_WEEK' | 'TWICE_A_WEEK';
  selectedDays: string[];
  startDate: string; // ISO
  liabilityAccepted: boolean;
  paymentMethod?: 'Cash' | 'Zelle' | 'Check' | string; // schema is String?
  waiverSignature?: { name?: string; address?: string };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResp>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const {
      studentName,
      age,
      parentName,
      phone,
      email,
      location,
      frequency,
      selectedDays,
      startDate,
      liabilityAccepted,
      paymentMethod,
      waiverSignature,
    } = req.body as ReqBody;

    // ---- minimal validation ----
    if (!studentName || !parentName || !email || !phone) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    if (!Array.isArray(selectedDays) || selectedDays.length === 0) {
      return res.status(400).json({ success: false, error: 'selectedDays required' });
    }
    if (!startDate) {
      return res.status(400).json({ success: false, error: 'startDate required' });
    }
    const start = new Date(startDate);
    if (Number.isNaN(start.getTime())) {
      return res.status(400).json({ success: false, error: 'startDate must be a valid ISO date' });
    }

    // ---- write to DB ----
    if (prisma) {
      // Build data object explicitly; only include optional fields when present
      const data: any = {
        studentName,
        age,
        parentName,
        phone,
        email,
        location,
        frequency,
        selectedDays,
        startDate: start,
        paymentStatus: 'PENDING',
        liabilityAccepted: !!liabilityAccepted,
        waiverName: waiverSignature?.name ?? null,
        waiverAddress: waiverSignature?.address ?? null,
      };
      if (paymentMethod) data.paymentMethod = paymentMethod;

      await prisma.student.create({ data });
    } else {
      console.warn('Prisma client not found; skipping DB write.');
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Register API error:', err);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
