import type { NextApiRequest, NextApiResponse } from 'next';
// If you have a Prisma client, import it. Adjust path to your setup.
import prisma from '@/lib/prisma'; // <-- change this import if your prisma client lives elsewhere

type ApiResp = { success: boolean; error?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResp>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    // Next.js pages API automatically parses JSON into req.body
    const {
      studentName,
      age,
      parentName,
      phone,
      email,
      location,           // 'KATY' | 'SUGARLAND'
      frequency,          // 'ONCE_A_WEEK' | 'TWICE_A_WEEK'
      selectedDays,       // e.g. ['Monday'] or ['Monday','Thursday']
      startDate,          // ISO string
      liabilityAccepted,  // boolean
      paymentMethod,      // 'Cash' | 'Zelle' | 'Check'
      waiverSignature,    // { name: string, address: string }
    } = req.body as {
      studentName: string;
      age: number;
      parentName: string;
      phone: string;
      email: string;
      location: 'KATY' | 'SUGARLAND';
      frequency: 'ONCE_A_WEEK' | 'TWICE_A_WEEK';
      selectedDays: string[];
      startDate: string;
      liabilityAccepted: boolean;
      paymentMethod: string;
      waiverSignature?: { name?: string; address?: string };
    };

    // --- Minimal validation (keeps bad rows out) ---
    if (!studentName || !parentName || !email || !phone) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    if (!Array.isArray(selectedDays) || selectedDays.length === 0) {
      return res.status(400).json({ success: false, error: 'selectedDays required' });
    }
    if (!startDate) {
      return res.status(400).json({ success: false, error: 'startDate required' });
    }

    // --- Write to DB (adjust to your Prisma schema field names) ---
    // Example Prisma model (roughly):
    // model Student {
    //   id             String   @id @default(cuid())
    //   studentName    String
    //   age            Int
    //   parentName     String
    //   phone          String
    //   email          String
    //   location       String
    //   frequency      String
    //   selectedDays   String[] // Postgres text[]
    //   startDate      DateTime
    //   paymentStatus  String   @default("PENDING")
    //   paymentMethod  String?
    //   liabilityAccepted Boolean
    //   waiverName     String?
    //   waiverAddress  String?
    //   createdAt      DateTime @default(now())
    // }

    if (prisma) {
      await prisma.student.create({
        data: {
          studentName,
          age,
          parentName,
          phone,
          email,
          location,
          frequency,
          selectedDays,
          startDate: new Date(startDate),
          paymentStatus: 'PENDING',
          paymentMethod,
          liabilityAccepted,
          waiverName: waiverSignature?.name ?? null,
          waiverAddress: waiverSignature?.address ?? null,
        },
      });
    } else {
      // If you don’t have Prisma wired yet, at least don’t break:
      console.warn('Prisma client not found; skipping DB write.');
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Register API error:', err);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
