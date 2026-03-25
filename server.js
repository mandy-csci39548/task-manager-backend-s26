import express from 'express'

const app = express()

const tasks = [
  {
    id: 1,
    description: 'This is a task',
    completed: false,
  },
  {
    id: 2,
    description: 'This is another task',
    completed: true,
  },
  { id: 3, description: 'Buy food', completed: false },
]

app.get('/hello', (req, res) => {
  res.send('Hello, World!!!!!!')
})

app.get('/tasks', (request, response) => {
  response.json(tasks)
})

app.listen(8000, () => {
  console.log('Server is running on port 8000')
})
