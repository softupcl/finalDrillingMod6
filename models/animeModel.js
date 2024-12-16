import {
  updateFile,
  readFile,
} from "../lib/data.js";

export class AnimeModel {
  static folder = '.data/'
  static fileName = 'anime.json'

  static async getAll() {
    let animes = await readFile(AnimeModel.folder, AnimeModel.fileName)

    return animes
  }

  static async getById(id) {
    let animes = await AnimeModel.getAll()

    return animes[id]
  }

  static async createAndUpdateAnime(animes) {
    try {
      await updateFile(AnimeModel.folder, AnimeModel.fileName, animes)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}