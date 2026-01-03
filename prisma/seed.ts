import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // --- KATY ---
  await prisma.classSection.upsert({
where: {
  location_day_label_session: {
    location: 'KATY',
    day: 'Tuesday',
    label: 'A',
    session: 'SPRING_2026',
  },
},
    update: {},
    create: {
      location: 'KATY',
      day: 'Tuesday',
      label: 'A',
      startDate: new Date('2025-08-26'),
      startTime: '2:00 PM',
      endTime: '3:00 PM',
      capacity: 22,
      priceCents: 24500,
    },
  });

  await prisma.classSection.upsert({
where: {
  location_day_label_session: {
    location: 'KATY',
    day: 'Tuesday',
    label: 'A',
    session: 'SPRING_2026',
  },
},
    update: {},
    create: {
      location: 'KATY',
      day: 'Wednesday',
      label: 'A',
      startDate: new Date('2025-08-27'),
      startTime: '2:00 PM',
      endTime: '3:00 PM',
      capacity: 22,
      priceCents: 24500,
    },
  });

  // --- SUGAR LAND ---
  await prisma.classSection.upsert({
where: {
  location_day_label_session: {
    location: 'KATY',
    day: 'Tuesday',
    label: 'A',
    session: 'SPRING_2026',
  },
},
    update: {},
    create: {
      location: 'SUGARLAND',
      day: 'Monday',
      label: 'A',
      startDate: new Date('2025-08-25'),
      startTime: '2:00 PM',
      endTime: '3:00 PM',
      capacity: 22,
      priceCents: 23000,
    },
  });

  await prisma.classSection.upsert({
where: {
  location_day_label_session: {
    location: 'KATY',
    day: 'Tuesday',
    label: 'A',
    session: 'SPRING_2026',
  },
},
    update: {},
    create: {
      location: 'SUGARLAND',
      day: 'Monday',
      label: 'B',
      startDate: new Date('2025-09-15'),
      startTime: '3:00 PM',
      endTime: '3:30 PM',
      capacity: 22,
      priceCents: 19500,
    },
  });

  await prisma.classSection.upsert({
where: {
  location_day_label_session: {
    location: 'KATY',
    day: 'Tuesday',
    label: 'A',
    session: 'SPRING_2026',
  },
},
    update: {},
    create: {
      location: 'SUGARLAND',
      day: 'Thursday',
      label: 'A',
      startDate: new Date('2025-08-28'),
      startTime: '2:00 PM',
      endTime: '3:00 PM',
      capacity: 22,
      priceCents: 24500,
    },
  });

  await prisma.classSection.upsert({
where: {
  location_day_label_session: {
    location: 'KATY',
    day: 'Tuesday',
    label: 'A',
    session: 'SPRING_2026',
  },
},
    update: {},
    create: {
      location: 'SUGARLAND',
      day: 'Thursday',
      label: 'B',
      startDate: new Date('2025-09-15'),
      startTime: '3:00 PM',
      endTime: '3:30 PM',
      capacity: 22,
      priceCents: 19500,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
