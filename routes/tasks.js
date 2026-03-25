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

export default router
