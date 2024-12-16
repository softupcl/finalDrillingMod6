import * as fs from 'node:fs/promises'
import * as path from 'node:path'

export const readFile = async (folder, fileName) => {

  let descriptorArchivo

  try {

    const filePath = path.join(folder, fileName);

    descriptorArchivo = await fs.open(filePath)

    const data = await fs.readFile(descriptorArchivo, { encoding: 'utf8' })
    return JSON.parse(data)
  } catch (err) {

    console.error(err)
  } finally {

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

export const updateFile = async (folder, fileName, data) => {
  const filePath = path.join(folder, fileName)
  let descriptorArchivo
  try {
    descriptorArchivo = await fs.open(filePath, 'r+')

    if(!descriptorArchivo) throw new Error('No existe archivo');
    
    try {
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


export const deleteFile = async (folder, fileName) => {
  try {
    let filePath = path.join(folder, fileName)

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
    const directories = await fs.readdir(folder);
    return directories
  } catch (err) {
    console.error(err)
  }
}