
import * as crypto from 'node:crypto'
import * as url from "node:url"

import {AnimeModel } from "../models/animeModel.js"

export const animeController = async (req, res, payloadBruto, urlparts) => {

  const queryObject = url.parse(req.url, true);

  if(req.method === 'GET' && !urlparts[2] && !queryObject.search) {
    try {
      let animes = await AnimeModel.getAll()
  
      res.writeHead(200, 'OK', { "content-type": "application/json" })
      res.end(JSON.stringify(animes))
    } catch (err) {
      res.writeHead(500, 'Internal Server Error', { "content-type": "application/json" })
      res.end(JSON.stringify({ message: err.message }))
    }
  }else if(req.method === 'GET' && !urlparts[2] && queryObject.search) {

    const  {nombre} = queryObject.query;
    const animes = await AnimeModel.getAll()

    const ids = Object.keys(animes);
   
    for (let id of ids){
      let anime = animes[id];
      if(!anime.titulo.toLowerCase().includes(nombre.toLowerCase())){
        delete animes[id];
      }
    }

    res.writeHead(200, 'OK', { "content-type": "application/json" })
    res.end(JSON.stringify(animes))

  }
  
  // Mostrar anime por id
  else if (req.method == 'GET' && urlparts[2] && urlparts.length <= 3 ) {
    let anime = await AnimeModel.getById(urlparts[2])

    if(anime) {
      res.writeHead(200, 'OK', { "content-type": "application/json" })
      res.end(JSON.stringify(anime))
    } else {
      res.writeHead(404, 'Not Found', { "content-type": "application/json" })
      res.end(JSON.stringify({ message: 'Anime no encontrado' }))
    }
  }
  // Crear Anime
  else if(req.method == 'POST' && !urlparts[2]) {
    try {

      const todosAnimes = await AnimeModel.getAll()  
      const id = parseInt(Object.keys(todosAnimes).at(-1)) + 1 ;

      let data = JSON.parse(payloadBruto)
      //let id = crypto.randomUUID()
    


      let animes = await AnimeModel.getAll() // 1
      animes[id] = data //2

      let status = await AnimeModel.createAndUpdateAnime(animes)
      if(status) {
        res.writeHead(201, 'Created', { "content-type": "application/json" })
        res.end(JSON.stringify({ message: 'Anime Creado' }))
      } else {
        res.writeHead(500, 'Internal Server Error', { "content-type": "application/json" })
        res.end(JSON.stringify({message: 'Error interno al crear anime'}))
      }
    } catch (err) {
      res.writeHead(400, 'Bad Request', { "content-type": "application/json" })
      res.end(JSON.stringify({ message: 'Error al procesar payload' }))
    }
  }

 //Actualizar Anime
  else if ( req.method == 'PUT' && urlparts[2] ) {
    try {
      let animes = await AnimeModel.getAll()
      let anime = await AnimeModel.getById(urlparts[2])

      if(anime) {
        try {
          let payload = JSON.parse(payloadBruto)
          anime = { ...anime, ...payload } 
          animes[urlparts[2]] = anime 

          await AnimeModel.createAndUpdateAnime(animes)

          res.writeHead(200, 'OK', { "content-type": "application/json" })
          return res.end(JSON.stringify({ message: 'actualizado', anime }))
        } catch (err) {
          res.writeHead(400, 'Bad Request', { "content-type": "application/json" })
          return res.end(JSON.stringify({ message: 'Error en data enviada' }))
        }
      } else {
        res.writeHead(404, 'Not Found', { "content-type": "application/json" })
        return res.end(JSON.stringify({ message: 'Anime no encontrado' }))
      }
    } catch (err) {
      res.writeHead(100, 'algo', { "content-type": "application/json" })
      return res.end(JSON.stringify({ message: err.message }))
    }
  }

  //Borrar Anime
  else if( req.method == 'DELETE' && urlparts[2] ) {
    let animes = await AnimeModel.getAll()

    let ids = Object.keys(animes)
    if(ids.includes(urlparts[2])) {
      delete animes[urlparts[2]]

      await AnimeModel.createAndUpdateAnime(animes)

      res.writeHead(200, 'OK', { "content-type": "application/json" })
      return res.end((JSON.stringify({ message: "Anime eliminado con éxito" })))
    } else {
      res.writeHead(404, 'Not Found', { "content-type": "application/json" })
      return res.end(JSON.stringify({ message: "Anime no encontrado" }))
    }
  }
}