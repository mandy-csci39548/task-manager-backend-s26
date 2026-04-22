import express from 'express'
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'
import { authMiddleware } from './auth.js'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const router = express.Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId: req.user.userId,
    },
  })

  res.json(tasks)
})

router.post('/', async (req, res) => {
  const { description, completed } = req.body

  if (
    typeof description !== 'string' ||
    description.length === 0 ||
    description.trim() === ''
  ) {
    return res.status(400).json({
      error: 'Description is required!',
    })
  }

  const task = await prisma.task.create({
    data: {
      description,
      completed,
      user: {
        connect: {
          id: req.user.userId,
        },
      }, // ✅
      // userId: req.user.userId ❌
    },
  })

  res.status(201).json(task)
})

router.put('/:id', async (req, res) => {
  const task = await prisma.task.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  })

  if (!task || task.userId !== req.user.userId) {
    return res.status(403).json({ error: 'Not authorized!' })
  }

  const { description, completed } = req.body

  if (
    typeof description !== 'string' ||
    description.length === 0 ||
    description.trim() === ''
  ) {
    return res.status(400).json({
      error: 'Description is required!',
    })
  }

  const id = parseInt(req.params.id)
  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        description,
        completed,
      },
    })

    res.json(task)
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Task not found',
      })
    }

    console.log(error)
    return res.status(500).json({
      error: 'Failed to update task',
    })
  }
})

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  const task = await prisma.task.findUnique({
    where: { id },
  })

  if (!task || task.userId !== req.user.userId) {
    return res.status(403).json({ error: 'Not authorized' })
  }

  try {
    await prisma.task.delete({
      where: { id },
    })

    res.status(204).json({ message: 'Task deleted successfully' })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Task not found',
      })
    }
    return res.status(500).json({
      error: 'Failed to delete task',
    })
  }
})

export default router
