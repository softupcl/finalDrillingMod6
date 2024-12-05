/**
 * Servir archivos estáticos
 * 
 * Sólo acepta GET
 */
import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import * as mime from 'mime-types'

export const publicController = async (req, res, urlParts) => {
  let { method } = req

  if(method == 'GET') {
    let rutaRecurso = path.join('public' ,...urlParts)
    try {
      const data = await fs.readFile(rutaRecurso)
      let MIMEType = mime.lookup(rutaRecurso)

      res.writeHead(200, 'OK', { "content-type": MIMEType })
      res.end(data)
    } catch (error) {
      res.writeHead(404, 'Not Found', { "content-type": "text/plain" })
      res.end('Recurso no encontrado')
    }
  } else {
    res.writeHead(400, 'Bad Request', { "content-type": "text/plain" })
    res.end('Error en la petición')
  }
}


