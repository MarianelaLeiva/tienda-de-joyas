import { 
  getJoyasHATEOASModel,
  getJoyasWithFiltersModel 
} from '../models/joyasModels.js'

export const getJoyasHATEOAS = async (req, res) => {
  try {
    const { limits = 10, page = 1, order_by = 'id_ASC' } = req.query
    
    const limites = Math.min(parseInt(limits), 50)
    const pagina = parseInt(page)
    
    if (pagina < 1 || limites < 1) {
      return res.status(400).json({ 
        error: 'Los parámetros page y limits deben ser mayores a 0' 
      })
    }
    
    const resultado = await getJoyasHATEOASModel({
      limits: limites,
      page: pagina,
      order_by: order_by
    })
    
    res.status(200).json(resultado)
    
  } catch (error) {
    console.error('Error en getJoyasHATEOAS:', error)
    res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      detalles: error.message 
    })
  }
}

export const getJoyasWithFilters = async (req, res) => {
  try {
    const { precio_min, precio_max, categoria, metal } = req.query
    
    if (!precio_min && !precio_max && !categoria && !metal) {
      return res.status(400).json({
        error: 'Debe proporcionar al menos un filtro (precio_min, precio_max, categoria o metal)'
      })
    }
    
    const filtros = {}
    if (precio_min) {
      const precioMin = parseInt(precio_min)
      if (isNaN(precioMin)) {
        return res.status(400).json({ error: 'precio_min debe ser un número válido' })
      }
      filtros.precio_min = precioMin
    }
    
    if (precio_max) {
      const precioMax = parseInt(precio_max)
      if (isNaN(precioMax)) {
        return res.status(400).json({ error: 'precio_max debe ser un número válido' })
      }
      filtros.precio_max = precioMax
    }
    
    if (categoria) filtros.categoria = categoria
    if (metal) filtros.metal = metal
    
    if (filtros.precio_min && filtros.precio_max && filtros.precio_min > filtros.precio_max) {
      return res.status(400).json({
        error: 'precio_min no puede ser mayor que precio_max'
      })
    }
    
    const joyasFiltradas = await getJoyasWithFiltersModel(filtros)
    
    res.status(200).json({
      total: joyasFiltradas.length,
      filtros_aplicados: filtros,
      joyas: joyasFiltradas
    })
    
  } catch (error) {
    console.error('Error en getJoyasWithFilters:', error)
    res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      detalles: error.message 
    })
  }
}