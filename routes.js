import { publicController } from "./controllers/publicController.js"
import {animeController } from "./controllers/animeController.js"

export const router = (req, res) => {
  const url = req.url
  const urlParts = url.split('/').filter(part => !!part).map(part => part.split("?")[0]);
  let payloadBruto = '' 
  req.on('data', chunk => {
    payloadBruto += chunk
  })

  req.on('end', () => {

    if(urlParts[0] != 'api') {
      publicController(req, res, urlParts)
    } 
    else if (urlParts[0] == 'api' && urlParts[1] == 'animes') {
      animeController(req, res, payloadBruto, urlParts)
    }

    else {
      res.writeHead(404, 'Not Found', { "content-type": "text/plain" })
      res.end('No encontrado')
    }
  })
}