import express from 'express'
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const router = express.Router()

router.get('/', async (req, res) => {
  const tasks = await prisma.task.findMany()

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
    },
  })

  res.status(201).json(task)
})

router.put('/:id', async (req, res) => {
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

export default router
