import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import joyasRoutes from './routes/joyas.routes.js'
import { joyasLog } from './middleware/joyas.middleware.js'

const PORT = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(cors())
app.use(joyasLog)

app.use('/api', joyasRoutes)

app.listen(PORT, console.log(`Server On http://localhost:${PORT}`))