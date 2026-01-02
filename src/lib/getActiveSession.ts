import prisma from '@/lib/prisma';
import { Session } from '@prisma/client';

let cached: { value: Session; ts: number } | null = null;
const CACHE_MS = 60_000; // 1 minute cache

export async function getActiveSession(): Promise<Session> {
  // Return cached value if fresh
  if (cached && Date.now() - cached.ts < CACHE_MS) {
    return cached.value;
  }

  const row = await prisma.appConfig.findUnique({
    where: { key: 'ACTIVE_SESSION' },
    select: { value: true },
  });

  if (!row?.value) {
    throw new Error('ACTIVE_SESSION not configured');
  }

  if (!(row.value in Session)) {
    throw new Error(`Invalid ACTIVE_SESSION: ${row.value}`);
  }

  const session = Session[row.value as keyof typeof Session];
  cached = { value: session, ts: Date.now() };

  return session;
}
