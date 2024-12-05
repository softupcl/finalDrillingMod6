/**
 * Librería para Data
 * 
 * Permitir operaciones de lectura escritura al FS
 * 
 * Actuará sobre carpeta oculta ".data/"
 * Todos los archivos tienen la extensión ".json"
 */

import * as fs from 'node:fs/promises'
import * as path from 'node:path'


/**
 * Lee un archivo con formato JSON y retorna un objeto
 *
 * @async
 * @param {string} folder - Nombre de carpeta
 * @param {string} fileName - Nombre de archivo
 * @returns {Promise<object>}
 */
export const readFile = async (folder, fileName) => {
  /**
   * descriptorArchivo -> Número que representa de forma única el archivo a manipular
   */
  let descriptorArchivo

  try {
    /**
     * Intentamos leer archivo
     */
    const filePath = path.join(folder, fileName);

    descriptorArchivo = await fs.open(filePath)

    const data = await fs.readFile(descriptorArchivo, { encoding: 'utf8' })
    return JSON.parse(data)
  } catch (err) {
    /**
     * Enviamos error a consola
     */
    console.error(err)
  } finally {
    /**
     * Cerramos archivo
     */
    if(descriptorArchivo) {
      await descriptorArchivo.close()
    }
  }
}

/**
 * Crea documento con data inicial
 * @param { string } folder - Indica la carpeta donde estará el documento
 * @param { string } fileName - Nombre de archivo con extensión
 * @param { object } data - Objeto JSON a almacenar
 */
export const createFile = async (folder, fileName, data) => {
  /**
   * Definimos ruta
   */
  const filePath = path.join(folder, fileName)
  let creado
  try {
    const descriptorArchivo = await fs.open(filePath)
    if(descriptorArchivo) {

      descriptorArchivo.close()
      console.log('Documento ya existía')
      creado = false
    }
  } catch (err) {
    /**
     * Manejando la creación del archivo en caso que no exista
     */
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), { encoding: 'utf8' })
      console.log('Documento creado')
      creado = true
    } catch (err) {
      console.error("Error creando archivo", err)
      creado = false
    }
  } finally {
    return creado
  }
}


/**
 * Reescribe el contenido de un archivo
 *
 * @async
 * @param { string } folder - Nombre de carpeta
 * @param { string } fileName - Nombre de archivo
 * @param { object } data - Contenido para reescribir
 * @returns { Promise<void> }
 */
export const updateFile = async (folder, fileName, data) => {
  const filePath = path.join(folder, fileName)
  let descriptorArchivo
  try {
    descriptorArchivo = await fs.open(filePath, 'r+')

    if(!descriptorArchivo) throw new Error('No existe archivo');
    
    try {
      /**
       * Tratamos de escribir
       * forzamos borrado con truncate
       */
      await descriptorArchivo.truncate(0)
      await fs.writeFile(descriptorArchivo, JSON.stringify(data), { encoding: 'utf8' })
    } catch (err) {
      console.error('Error escribiendo archivo', err)
    }

  } catch (err) {
    console.error("Error leyendo archivo", err)
  } finally {
    if(descriptorArchivo) {
      await descriptorArchivo.close()
    }
  }
}

/**
 * Borra archivo o acceso directo usando carpeta y nombre de archivo
 *
 * @async
 * @param { string } folder - Nombre de carpeta como string
 * @param { string } fileName - Nombre de archivo como string
 * @returns { Promise.<void> }
 */
export const deleteFile = async (folder, fileName) => {
  try {
    let filePath = path.join(folder, fileName)
    /**
     * Unlink elimina accesos directos (symlink)
     * o elimina archivos en su defecto
    */
    await fs.unlink(filePath)
  } catch (err) {
    console.error("Error eliminando archivo", err)
  }
}

export const fileExists = async(folder, fileName) => {
  let filePath = path.join(folder, fileName)
  try {
    await fs.access(filePath);

    console.log(`El archivo "${filePath}" existe.`);
    return true;
  } catch {
    console.log(`El archivo "${filePath}" no existe.`);
    return false;
  }
}

export const listAll = async(folder) => {
  try {
    const directories = await fs.readdir(folder/*, { withFileTypes: true } */);
    return directories
  } catch (err) {
    console.error(err)
  }
}