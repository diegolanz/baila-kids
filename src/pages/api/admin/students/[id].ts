import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const data = req.body;
    try {
      const updated = await prisma.student.update({
        where: { id: id as string },
        data,
        });

      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update student' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
