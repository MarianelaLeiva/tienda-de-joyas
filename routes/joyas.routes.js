import { Router } from 'express'
import { getJoyasHATEOAS, getJoyasWithFilters } from '../src/controllers/joyasController.js'

const router = Router()

router.get('/joyas', getJoyasHATEOAS)
router.get('/joyas/filtros', getJoyasWithFilters)

export default router