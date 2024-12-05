
import * as crypto from 'node:crypto'
import * as url from "node:url"

import {AnimeModel } from "../models/animeModel.js"

export const animeController = async (req, res, payloadBruto, urlparts) => {

  const queryObject = url.parse(req.url, true);

  if(req.method === 'GET' && !urlparts[2] && !queryObject.search) {
    try {
      let discos = await AnimeModel.getAll()
  
      res.writeHead(200, 'OK', { "content-type": "application/json" })
      res.end(JSON.stringify(discos))
    } catch (err) {
      res.writeHead(500, 'Internal Server Error', { "content-type": "application/json" })
      res.end(JSON.stringify({ message: err.message }))
    }
  }else if(req.method === 'GET' && !urlparts[2] && queryObject.search) {

    const  {nombre} = queryObject.query;
    const discos = await AnimeModel.getAll()

    const ids = Object.keys(discos);
   
    for (let id of ids){
      let disco = discos[id];
      if(!disco.titulo.toLowerCase().includes(nombre.toLowerCase())){
        delete discos[id];
      }
    }

    res.writeHead(200, 'OK', { "content-type": "application/json" })
    res.end(JSON.stringify(discos))

  }
  
  // Mostrar anime por id
  else if (req.method == 'GET' && urlparts[2] && urlparts.length <= 3 ) {
    let disco = await AnimeModel.getById(urlparts[2])

    if(disco) {
      res.writeHead(200, 'OK', { "content-type": "application/json" })
      res.end(JSON.stringify(disco))
    } else {
      res.writeHead(404, 'Not Found', { "content-type": "application/json" })
      res.end(JSON.stringify({ message: 'Disco no encontrado' }))
    }
  }
  // Crear Anime
  else if(req.method == 'POST' && !urlparts[2]) {
    try {
      let data = JSON.parse(payloadBruto)
      let id = crypto.randomUUID()


      let discos = await AnimeModel.getAll() // 1
      discos[id] = data //2

      let status = await AnimeModel.createAndUpdateDisc(discos)
      if(status) {
        res.writeHead(201, 'Created', { "content-type": "application/json" })
        res.end(JSON.stringify({ message: 'Disco Creado' }))
      } else {
        res.writeHead(500, 'Internal Server Error', { "content-type": "application/json" })
        res.end(JSON.stringify({message: 'Error interno al crear disco'}))
      }
    } catch (err) {
      res.writeHead(400, 'Bad Request', { "content-type": "application/json" })
      res.end(JSON.stringify({ message: 'Solicitud mal hecha'}))
    }
  }

 //Actualizar Anime
  else if ( req.method == 'PUT' && urlparts[2] ) {
    try {
      let discos = await AnimeModel.getAll()
      let disco = await AnimeModel.getById(urlparts[2])

      if(disco) {
        try {
          let payload = JSON.parse(payloadBruto)
          disco = { ...disco, ...payload } // disco (singular) actualizado
          discos[urlparts[2]] = disco // Actualizamos todos los discos

          await AnimeModel.createAndUpdateDisc(discos)

          res.writeHead(200, 'OK', { "content-type": "application/json" })
          return res.end(JSON.stringify({ message: 'updated', disco }))
        } catch (err) {
          res.writeHead(400, 'Bad Request', { "content-type": "application/json" })
          return res.end(JSON.stringify({ message: 'Payload mal formado' }))
        }
      } else {
        res.writeHead(404, 'Not Found', { "content-type": "application/json" })
        return res.end(JSON.stringify({ message: 'Disco no encontrado' }))
      }
    } catch (err) {
      res.writeHead(100, 'algo', { "content-type": "application/json" })
      return res.end(JSON.stringify({ message: err.message }))
    }
  }

  //Borrar Anime
  else if( req.method == 'DELETE' && urlparts[2] ) {
    let discos = await AnimeModel.getAll()

    let ids = Object.keys(discos)
    if(ids.includes(urlparts[2])) {
      delete discos[urlparts[2]]

      await AnimeModel.createAndUpdateDisc(discos)

      res.writeHead(200, 'OK', { "content-type": "application/json" })
      return res.end((JSON.stringify({ message: "Disco eliminado con éxito" })))
    } else {
      res.writeHead(404, 'Not Found', { "content-type": "application/json" })
      return res.end(JSON.stringify({ message: "Disco no encontrado" }))
    }
  }
}