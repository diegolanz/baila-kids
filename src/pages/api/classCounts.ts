// src/pages/api/classCounts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

type DayKey = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
type LocationKey = 'KATY' | 'SUGARLAND';

const daysMap: Record<LocationKey, DayKey[]> = {
  KATY: ['Tuesday', 'Wednesday'],
  SUGARLAND: ['Monday', 'Thursday'],
};

type Counts = Record<LocationKey, Record<DayKey, number>>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    // Pull only fields we need
    const students = await prisma.student.findMany({
      where: {
        session: 'SPRING_2026',
      },
      select: {
        location: true,
        selectedDays: true,
      },
    });


    // Initialize zeroed structure
    const counts: Counts = {
      KATY:    { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0 },
      SUGARLAND: { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0 },
    };

    // Count each student ON EACH DAY they attend
    for (const s of students) {
      const loc = s.location as LocationKey;
      if (!loc) continue;
      for (const day of s.selectedDays as DayKey[]) {
        if (counts[loc] && counts[loc][day] !== undefined) {
          counts[loc][day] += 1;
        }
      }
    }

    // Only keep real class days per site (optional: zero out non-used days)
    for (const loc of Object.keys(daysMap) as LocationKey[]) {
      const validDays = new Set(daysMap[loc]);
      (Object.keys(counts[loc]) as DayKey[]).forEach(day => {
        if (!validDays.has(day)) counts[loc][day] = 0;
      });
    }

    res.status(200).json({ counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute class counts' });
  }
}
