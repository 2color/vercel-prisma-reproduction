import prisma from '../lib/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client'

export default async function handle(req, res) {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true },
      orderBy: [{ id: 'desc' }],
      take: 25,
    })
    res.json(posts)
  } catch (error) {
    console.error(error)
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(422).json({ error: error.message, code: error.code })
    } else {
      res.status(500).json(error)
    }
  }
}
