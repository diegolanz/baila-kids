// scripts/backfillEnrollments.ts
import { PrismaClient, $Enums } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const students = await prisma.student.findMany();

  for (const s of students) {
    for (const day of s.selectedDays) {
      // Cast string ("Monday") into Prisma Day enum
      const sec = await prisma.classSection.findFirst({
        where: { location: s.location, day: day as $Enums.Day },
      });
      if (!sec) {
        console.warn(`No section found for ${s.location} ${day}, skipping ${s.studentName}`);
        continue;
      }
      await prisma.enrollment.upsert({
        where: {
          studentId_sectionId: { studentId: s.id, sectionId: sec.id },
        },
        update: {},
        create: {
          studentId: s.id,
          sectionId: sec.id,
          status: 'ACTIVE',
        },
      });
      console.log(`Enrolled ${s.studentName} in ${s.location} ${day} ${sec.label}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
