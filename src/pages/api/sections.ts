// pages/api/sections.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { $Enums } from '@prisma/client'; // v6: enums exported here
import { isRegistrationOpen } from '@/lib/getRegistrationStatus';
import { getActiveSession } from '@/lib/getActiveSession';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  try {

    const registrationOpen = await isRegistrationOpen();
    const session = await getActiveSession();


    const sections = await prisma.classSection.findMany({
      where: { isActive: true, session, },
      include: {
        enrollments: {
          where: { status: $Enums.EnrollmentStatus.ACTIVE },
          select: { id: true },
        },
      },
      orderBy: [{ location: 'asc' }, { day: 'asc' }, { label: 'asc' }],
    });

    const shaped = sections.map((s) => ({
      id: s.id,
      location: s.location,           // "SUGARLAND"
      day: s.day,                     // "Monday" | "Thursday"
      label: s.label,                 // "A" | "B"
      startDate: s.startDate ?? null,
      startTime: s.startTime ?? null,
      endTime: s.endTime ?? null,
      priceCents: s.priceCents,
      capacity: s.capacity,
      activeCount: s.enrollments.length,
      seatsRemaining: Math.max(0, s.capacity - s.enrollments.length),
    }));

    res.json({
      registrationOpen,
      sections: shaped,
    });
  } catch (err) {
    console.error('sections API error', err);
    res.status(500).json({ sections: [], error: 'Internal error' });
  }
}
