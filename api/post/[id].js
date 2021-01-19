import prisma from '../../lib/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client'


export default async function handle(req, res) {
  const postId = req.query.id

  if (req.method === 'GET') {
    handleGET(postId, res)
  } else if (req.method === 'DELETE') {
    handleDELETE(postId, res)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    )
  }
}

// GET /api/post/:id
async function handleGET(postId, res) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
      include: { author: true },
    })
    res.json(post)
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(422).json({ error: error.message, code: error.code })
    } else {
      res.status(500).json(error)
    }
  }
}

// DELETE /api/post/:id
async function handleDELETE(postId, res) {
  try {
    const post = await prisma.post.delete({
      where: { id: Number(postId) },
    })
    res.json(post)
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(422).json({ error: error.message, code: error.code })
    } else {
      res.status(500).json(error)
    }
  }
}
