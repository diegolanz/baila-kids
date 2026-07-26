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
      orderBy: [
        { city: 'asc' },
        { school: 'asc' },
        { day: 'asc' },
        { label: 'asc' },
      ],
    });

    const shaped = sections.map((s) => ({
      id: s.id,
      city: s.city,
      school: s.school,
      day: s.day,                     // "Monday" | "Thursday"
      label: s.label,                 // "A" | "B"
      startDate: s.startDate ?? null,
      endDate: s.endDate ?? null,
      startTime: s.startTime ?? null,
      eligibleClasses: s.eligibleClasses ?? [],
      endTime: s.endTime ?? null,
      priceCents: s.priceCents,
      bundlePriceCents: s.bundlePriceCents ?? null,
      capacity: s.capacity,
      activeCount: s.enrollments.length,
      seatsRemaining: Math.max(0, s.capacity - s.enrollments.length),
    }));

    res.json({
      registrationOpen,
      sections: shaped,
    });
  } catch (err) {
    console.error("========== SECTIONS API ERROR ==========");
    console.dir(err, { depth: null });

    res.status(500).json({
      sections: [],
      error: String(err),
    });
  }
}
