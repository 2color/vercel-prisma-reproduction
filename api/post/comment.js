import prisma from '../../lib/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client'

export default async function handle(req, res) {
  if (req.method === 'POST') {
    try {
      const { comment, postId, authorEmail } = req.body

      const result = await prisma.comment.create({
        data: {
          comment,
          post: { connect: { id: parseInt(postId) } },
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
