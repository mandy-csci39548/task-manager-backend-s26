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

export default router
