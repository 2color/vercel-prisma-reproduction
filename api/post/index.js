import prisma from '../../lib/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client'

// POST /api/post
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, content, authorEmail } = req.body
      const result = await prisma.post.create({
        data: {
          title: title,
          content: content,
          author: { connect: { email: authorEmail } },
        },
      })
      res.json(result)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        res.status(422).json({ error: error.message, code: error.code })
      } else {
        res.status(500).json(error)
      }
    }
  }
}
