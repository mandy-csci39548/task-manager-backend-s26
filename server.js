import express from 'express'
import tasksRouter from './routes/tasks.js'
import cors from 'cors'

const app = express()
app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
)

app.use('/tasks', tasksRouter)

app.listen(8000, () => {
  console.log('Server is running on port 8000')
})
