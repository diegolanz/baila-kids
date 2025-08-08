import { PrismaClient, SchoolLocation, ClassFrequency, PaymentStatus } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest,
    res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    studentName,
    age,
    parentName,
    phone,
    email,
    location,
    frequency,
    selectedDays,
    startDate,
  } = req.body;

  try {
    const student = await prisma.student.create({
      data: {
        studentName,
        age: parseInt(age),
        parentName,
        phone,
        email,
        location: location as SchoolLocation,
        frequency: frequency as ClassFrequency,
        selectedDays,
        startDate: new Date(startDate),
        paymentStatus: PaymentStatus.PENDING,
      },
    });

    return res.status(200).json({ success: true, student });
  } catch (error) {
    console.error('Error saving student:', error);
    return res.status(500).json({ success: false, error: 'Failed to save student' });
  }
}
