import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const port = process.env.PORT || 3001
const publicPath = path.join(__dirname, 'public')
const distPath = path.join(__dirname, 'dist')

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'City One Adventures API is running.' })
})

app.post('/api/inquiries', (req, res) => {
  const { name, email, phone, travelDate, travelers, destination, message } = req.body || {}

  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Name, email, and message are required.',
    })
  }

  const inquiry = {
    name,
    email,
    phone: phone || '[NOT PROVIDED]',
    travelDate: travelDate || '[NOT PROVIDED]',
    travelers: travelers || 1,
    destination: destination || '[NOT PROVIDED]',
    message,
    createdAt: new Date().toISOString(),
  }

  console.log('New inquiry received:', inquiry)

  return res.status(201).json({
    success: true,
    message: 'Inquiry received. A travel advisor will contact you soon.',
    inquiry,
  })
})

app.use(express.static(publicPath))
app.use(express.static(distPath))

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`City One Adventures API listening on http://localhost:${port}`)
})
