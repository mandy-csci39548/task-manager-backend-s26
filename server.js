import express from 'express'
import tasksRouter from './routes/tasks.js'

const app = express()

app.use('/tasks', tasksRouter)

app.listen(8000, () => {
  console.log('Server is running on port 8000')
})
