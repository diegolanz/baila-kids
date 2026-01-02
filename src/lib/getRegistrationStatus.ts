import prisma from '@/lib/prisma';

export async function isRegistrationOpen(): Promise<boolean> {
  const row = await prisma.appConfig.findUnique({
    where: { key: 'REGISTRATION_OPEN' },
    select: { value: true },
  });

  return row?.value === 'true';
}
