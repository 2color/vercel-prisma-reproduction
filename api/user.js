import prisma from '../lib/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client'

// POST /api/user
// Required fields in body: name, email
export default async function handle(req, res) {
  if (req.method === 'POST') {
    const { email, name } = req.body
    try {
      const result = await prisma.user.create({
        data: {
          email,
          name,
        },
      })
      res.json(result)
    } catch (error) {
      console.error(error)
      if (error instanceof PrismaClientKnownRequestError) {
        res.status(422).json({ error: error.message, code: error.code })
      } else {
        res.status(500)
      }
    }
  }
}
