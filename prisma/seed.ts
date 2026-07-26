import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const sections: Prisma.ClassSectionCreateInput[] = [
  // ==========================
  // HOUSTON - SUGAR LAND
  // ==========================
  {
  city: 'HOUSTON',
  school: 'SUGARLAND',
  day: 'Monday',
  label: 'A',
  startDate: new Date('2026-08-31'),
  endDate: new Date('2026-12-07'),
  startTime: '2:10 PM',
  endTime: '2:45 PM',
  capacity: 22,
  priceCents: 21500,
  bundlePriceCents: 44000,
  session: 'FALL_2026',
  eligibleClasses: ['Colombia','Costa Rica','Argentina','Venezuela','España'],
},
{
  city:'HOUSTON',school:'SUGARLAND',day:'Monday',label:'B',
  startDate:new Date('2026-08-31'),
  endDate:new Date('2026-12-07'),
  startTime:'3:00 PM',endTime:'3:30 PM',
  capacity:22,priceCents:21500,bundlePriceCents:44000,session:'FALL_2026',
  eligibleClasses:['Colombia','Costa Rica','Argentina','Venezuela','España'],
},
{
  city:'HOUSTON',school:'SUGARLAND',day:'Thursday',label:'A',
  startDate:new Date('2026-09-03'),
  endDate:new Date('2026-12-10'),
  startTime:'2:10 PM',endTime:'2:45 PM',
  capacity:22,priceCents:25000,bundlePriceCents:44000,session:'FALL_2026',
  eligibleClasses:['Colombia','Costa Rica','Argentina','Venezuela','España'],
},
{
  city:'HOUSTON',school:'SUGARLAND',day:'Thursday',label:'B',
  startDate:new Date('2026-09-03'),
  endDate:new Date('2026-12-10'),
  startTime:'3:00 PM',endTime:'3:30 PM',
  capacity:22,priceCents:25000,bundlePriceCents:44000,session:'FALL_2026',
  eligibleClasses:['Colombia','Costa Rica','Argentina','Venezuela','España'],
},
{
  city:'HOUSTON',school:'SUGARLAND',day:'Friday',label:'A',
  startDate:new Date('2026-09-04'),
  endDate:new Date('2026-12-11'),
  startTime:'2:10 PM',endTime:'2:45 PM',
  capacity:22,priceCents:25000,session:'FALL_2026',
  eligibleClasses:['Paraguay','Perú','México'],
},
{
  city:'HOUSTON',school:'SUGARLAND',day:'Friday',label:'B',
  startDate:new Date('2026-09-04'),
  endDate:new Date('2026-12-11'),
  startTime:'3:00 PM',endTime:'3:30 PM',
  capacity:22,priceCents:25000,session:'FALL_2026',
  eligibleClasses:['Paraguay','Perú','México'],
},

{city:'HOUSTON',school:'KATY',day:'Tuesday',label:'A',startDate:new Date('2026-09-01'),endDate:new Date('2026-12-08'),startTime:'2:10 PM',endTime:'2:45 PM',capacity:22,priceCents:25000,bundlePriceCents:47500,session:'FALL_2026',eligibleClasses:['Colombia','Costa Rica','Argentina','Venezuela','España']},
{city:'HOUSTON',school:'KATY',day:'Wednesday',label:'A',startDate:new Date('2026-09-02'),endDate:new Date('2026-12-09'),startTime:'2:10 PM',endTime:'2:45 PM',capacity:22,priceCents:25000,bundlePriceCents:47500,session:'FALL_2026',eligibleClasses:['Colombia','Costa Rica','Argentina','Venezuela','España']},

{city:'DALLAS',school:'ALLEN',day:'Tuesday',label:'A',startDate:new Date('2026-09-01'),endDate:new Date('2026-12-08'),startTime:'2:10 PM',endTime:'2:45 PM',capacity:22,priceCents:25000,bundlePriceCents:47500,session:'FALL_2026',eligibleClasses:['Colombia','Costa Rica','Bolivia','Argentina','Venezuela','España']},
{city:'DALLAS',school:'ALLEN',day:'Tuesday',label:'B',startDate:new Date('2026-09-01'),endDate:new Date('2026-12-08'),startTime:'3:00 PM',endTime:'3:30 PM',capacity:22,priceCents:25000,bundlePriceCents:47500,session:'FALL_2026',eligibleClasses:['Colombia','Costa Rica','Bolivia','Argentina','Venezuela','España']},
{city:'DALLAS',school:'ALLEN',day:'Wednesday',label:'A',startDate:new Date('2026-09-02'),endDate:new Date('2026-12-09'),startTime:'2:10 PM',endTime:'2:45 PM',capacity:22,priceCents:25000,bundlePriceCents:47500,session:'FALL_2026',eligibleClasses:['Colombia','Costa Rica','Bolivia','Argentina','Venezuela','España']},
{city:'DALLAS',school:'ALLEN',day:'Wednesday',label:'B',startDate:new Date('2026-09-02'),endDate:new Date('2026-12-09'),startTime:'3:00 PM',endTime:'3:30 PM',capacity:22,priceCents:25000,bundlePriceCents:47500,session:'FALL_2026',eligibleClasses:['Colombia','Costa Rica','Bolivia','Argentina','Venezuela','España']},

{city:'DALLAS',school:'FRISCO',day:'Monday',label:'A',startDate:new Date('2026-08-31'),endDate:new Date('2026-12-07'),startTime:'2:10 PM',endTime:'2:45 PM',capacity:22,priceCents:21500,bundlePriceCents:44000,session:'FALL_2026',eligibleClasses:['Colombia','Costa Rica','Argentina','Venezuela','España']},
{city:'DALLAS',school:'FRISCO',day:'Monday',label:'B',startDate:new Date('2026-08-31'),endDate:new Date('2026-12-07'),startTime:'3:00 PM',endTime:'3:30 PM',capacity:22,priceCents:21500,bundlePriceCents:44000,session:'FALL_2026',eligibleClasses:['Colombia','Costa Rica','Argentina','Venezuela','España']},
{city:'DALLAS',school:'FRISCO',day:'Thursday',label:'A',startDate:new Date('2026-09-03'),endDate:new Date('2026-12-10'),startTime:'2:10 PM',endTime:'2:45 PM',capacity:22,priceCents:25000,bundlePriceCents:44000,session:'FALL_2026',eligibleClasses:['Colombia','Costa Rica','Argentina','Venezuela','España']},
{city:'DALLAS',school:'FRISCO',day:'Thursday',label:'B',startDate:new Date('2026-09-03'),endDate:new Date('2026-12-10'),startTime:'3:00 PM',endTime:'3:30 PM',capacity:22,priceCents:25000,bundlePriceCents:44000,session:'FALL_2026',eligibleClasses:['Colombia','Costa Rica','Argentina','Venezuela','España']},

{city:'DALLAS',school:'CASTLE_HILLS',day:'Tuesday',label:'A',startDate:new Date('2026-09-01'),endDate:new Date('2026-12-08'),startTime:'2:10 PM',endTime:'2:45 PM',capacity:22,priceCents:25000,session:'FALL_2026',eligibleClasses:['Colombia','Costa Rica','Argentina','Venezuela','España']},

{city:'DALLAS',school:'NORTH_DALLAS',day:'Monday',label:'A',startDate:new Date('2026-08-31'),endDate:new Date('2026-12-07'),startTime:'2:10 PM',endTime:'2:45 PM',capacity:22,priceCents:21500,bundlePriceCents:44000,session:'FALL_2026',eligibleClasses:['Colombia','Costa Rica','Argentina','Venezuela','España']},
{city:'DALLAS',school:'NORTH_DALLAS',day:'Tuesday',label:'A',startDate:new Date('2026-09-01'),endDate:new Date('2026-12-08'),startTime:'2:10 PM',endTime:'2:45 PM',capacity:22,priceCents:25000,bundlePriceCents:44000,session:'FALL_2026',eligibleClasses:['Colombia','Costa Rica','Argentina','Venezuela','España']},

{city:'DALLAS',school:'PRESTON_TRAIL',day:'Wednesday',label:'A',startDate:new Date('2026-09-02'),endDate:new Date('2026-12-09'),startTime:'2:10 PM',endTime:'2:45 PM',capacity:22,priceCents:25000,session:'FALL_2026',eligibleClasses:['Costa Rica','Venezuela']},
];

async function main() {
  await prisma.appConfig.upsert({
    where:{key:"ACTIVE_SESSION"},
    update:{value:"FALL_2026"},
    create:{key:"ACTIVE_SESSION",value:"FALL_2026"},
  });

  for (const section of sections) {
    await prisma.classSection.upsert({
      where:{
        city_school_day_label_session:{
          city:section.city,
          school:section.school,
          day:section.day,
          label:section.label,
          session:section.session,
        },
      },
      update:section,
      create:{...section,isActive:true},
    });
  }

  console.log(`Seeded ${sections.length} class sections.`);
}

main().then(async()=>{await prisma.$disconnect();}).catch(async(e)=>{console.error(e);await prisma.$disconnect();process.exit(1);});