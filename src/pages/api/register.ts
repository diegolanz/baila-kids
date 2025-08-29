import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import {
  Prisma,
  SchoolLocation,
  ClassFrequency,
  PaymentStatus,
  EnrollmentStatus,
} from '@prisma/client';

type ApiResp = { success: boolean; error?: string };

// Backward-compatible request (current UI)
type LegacyReqBody = {
  studentName: string;
  age: number;
  parentName: string;
  phone: string;
  email: string;
  location: 'KATY' | 'SUGARLAND';
  frequency: 'ONCE_A_WEEK' | 'TWICE_A_WEEK';
  selectedDays: string[]; // legacy: ['Monday'] or ['Monday','Thursday']
  startDate: string;      // ISO
  liabilityAccepted: boolean;
  paymentMethod?: 'Cash' | 'Zelle' | 'Check' | string;
  waiverSignature?: { name?: string; address?: string };
};

// New section-based request (Sugar Land A/B)
type SectionReqBody = {
  studentName: string;
  age: number;
  parentName: string;
  phone: string;
  email: string;
  paymentMethod?: 'Cash' | 'Zelle' | 'Check' | string;
  liabilityAccepted: boolean;
  waiverSignature?: { name?: string; address?: string };

  // NEW: pass 1 or 2 section IDs (e.g., Monday A id, Thursday B id)
  sectionIds: string[];
};

// Simple type guard
function isSectionPayload(b: unknown): b is SectionReqBody {
  if (typeof b !== 'object' || b === null) return false;
  const maybe = b as { sectionIds?: unknown };
  return Array.isArray(maybe.sectionIds) && maybe.sectionIds.length >= 1;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResp>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const body = req.body;

    // ---- COMMON validation ----
    const studentName: string | undefined = body?.studentName?.trim();
    const parentName: string | undefined = body?.parentName?.trim();
    const email: string | undefined = body?.email?.trim();
    const phone: string | undefined = body?.phone?.trim();
    const ageNum: number = Number(body?.age);
    const liabilityAccepted: boolean = !!body?.liabilityAccepted;
    const paymentMethod: string | undefined = body?.paymentMethod;

    if (!studentName || !parentName || !email || !phone) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    if (!Number.isFinite(ageNum) || ageNum < 1 || ageNum > 17) {
      return res.status(400).json({ success: false, error: 'Invalid age' });
    }
    if (!liabilityAccepted) {
      return res.status(400).json({ success: false, error: 'Liability must be accepted' });
    }

    // ----------------------------------------------------------------
    // NEW PATH: section-based registration (Sugar Land A/B now, scalable later)
    // ----------------------------------------------------------------
    if (isSectionPayload(body)) {
      const sectionIds = body.sectionIds;

      if (sectionIds.length > 2) {
        return res.status(400).json({ success: false, error: 'Too many sections selected' });
      }

      // Load sections and current ACTIVE counts
      const sections = await prisma.classSection.findMany({
        where: { id: { in: sectionIds } },
        include: { enrollments: { where: { status: 'ACTIVE' } } },
      });

      if (sections.length !== sectionIds.length) {
        return res.status(400).json({ success: false, error: 'Invalid section selection' });
      }

      // Create student (keep same fields you already persist)
      const data: Prisma.StudentCreateInput = {
        studentName,
        age: ageNum,
        parentName,
        phone,
        email,
        // We cannot infer precise location/frequency from sections
        // but to keep your enums valid, take the first section's location
        // and infer frequency from the count
        location: sections[0].location as SchoolLocation,
        frequency:
          (sectionIds.length === 1 ? 'ONCE_A_WEEK' : 'TWICE_A_WEEK') as ClassFrequency,
        selectedDays: [], // legacy field no longer used for these registrations
        startDate: sections[0].startDate ?? new Date(), // optional: first section startDate
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: paymentMethod ?? null,
        liabilityAccepted: true,
        waiverName: body?.waiverSignature?.name ?? null,
        waiverAddress: body?.waiverSignature?.address ?? null,
      };

      const student = await prisma.student.create({ data });

      // Create enrollment rows (ACTIVE if capacity > activeCount, else WAITLISTED)
      for (const s of sections) {
        const activeCount = s.enrollments.length;
        const hasSeat = activeCount < s.capacity;

        await prisma.enrollment.create({
          data: {
            studentId: student.id,
            sectionId: s.id,
            status: hasSeat ? EnrollmentStatus.ACTIVE : EnrollmentStatus.WAITLISTED,
          },
        });
      }

      return res.status(200).json({ success: true });
    }

    // ----------------------------------------------------------------
    // LEGACY PATH: your existing Katy/Sugar Land (single-slot-per-day) payload
    // ----------------------------------------------------------------
    const {
      location,
      frequency,
      selectedDays,
      startDate,
      waiverSignature,
    } = body as LegacyReqBody;

    // Minimal legacy validation (unchanged)
    if (!location || !frequency) {
      return res.status(400).json({ success: false, error: 'Missing location or frequency' });
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

    // Write to Student as before
    const data: Prisma.StudentCreateInput = {
      studentName,
      age: ageNum,
      parentName,
      phone,
      email,
      location: location as SchoolLocation,
      frequency: frequency as ClassFrequency,
      selectedDays,
      startDate: new Date(start),
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: paymentMethod ?? null,
      liabilityAccepted: true,
      waiverName: waiverSignature?.name ?? null,
      waiverAddress: waiverSignature?.address ?? null,
    };

    await prisma.student.create({ data });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Register API error:', err);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
