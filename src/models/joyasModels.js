import format from 'pg-format'
import pool from '../../db/config.js'

export const getJoyasHATEOASModel = async ({ limits = 10, page = 1, order_by = 'id_ASC' }) => {
  try {
    const [attribute, direction] = order_by.split('_')
    const offset = (page - 1) * limits

    const formatQuery = format(
      'SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s',
      attribute,
      direction,
      limits,
      offset
    )
    
    console.log('Consulta HATEOAS:', formatQuery)
    const { rows: joyas } = await pool.query(formatQuery)
    
    const stockTotal = joyas.reduce((total, joya) => total + joya.stock, 0)
    
    return {
      totalJoyas: joyas.length,
      stockTotal: stockTotal,
      results: joyas.map(joya => ({
        name: joya.nombre,
        href: `/joyas/joya/${joya.id}`
      }))
    }
    
  } catch (error) {
    console.error('Error en getJoyasHATEOASModel:', error)
    throw new Error(`Error obteniendo joyas: ${error.message}`)
  }
}

export const getJoyasWithFiltersModel = async (filtros) => {
  try {
    const { precio_min, precio_max, categoria, metal } = filtros
    
    let consulta = 'SELECT * FROM inventario WHERE 1=1'
    const valores = []
    let contador = 1
    
    if (precio_min !== null && precio_min !== undefined) {
      consulta += ` AND precio >= $${contador}`
      valores.push(parseInt(precio_min))
      contador++
    }
    
    if (precio_max !== null && precio_max !== undefined) {
      consulta += ` AND precio <= $${contador}`
      valores.push(parseInt(precio_max))
      contador++
    }
    
    if (categoria) {
      consulta += ` AND categoria = $${contador}`
      valores.push(categoria)
      contador++
    }
    
    if (metal) {
      consulta += ` AND metal = $${contador}`
      valores.push(metal)
      contador++
    }

    const SQLquery = {
      text: consulta,
      values: valores
    }
    
    console.log('Consulta filtros parametrizada:', SQLquery)
    const { rows: joyas } = await pool.query(SQLquery)
    console.log('Resultados filtros:', joyas.length, 'registros')
    
    return joyas
    
  } catch (error) {
    console.error('Error en getJoyasWithFiltersModel:', error)
    throw new Error(`Error filtrando joyas: ${error.message}`)
  }
}

export const getJoyasModel = async () => {
  try {
    const sqlQuery = 'SELECT * FROM inventario'
    const response = await pool.query(sqlQuery)
    return response.rows
  } catch (error) {
    console.error('Error en getJoyasModel:', error)
    throw new Error(`Error obteniendo todas las joyas: ${error.message}`)
  }
}