/**
 * Grabamos o leemos datos relativos a Los Beatles
 */

import {
  updateFile,
  readFile,
} from "../lib/data.js";

export class AnimeModel {
  static folder = '.data/'
  static fileName = 'anime.json'

  static async getAll() {
    let discos = await readFile(AnimeModel.folder, AnimeModel.fileName)

    return discos
  }

  static async getById(id) {
    let discos = await AnimeModel.getAll()

    return discos[id]
  }

  static async createAndUpdateDisc(discos) {
    try {
      await updateFile(AnimeModel.folder, AnimeModel.fileName, discos)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}