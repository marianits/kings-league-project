import path from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'

const DB_PATH = path.join(process.cwd(), './db/')

async function readDBFile (dbName) {
  return readFile(`${DB_PATH}/${dbName}.json`, 'utf-8').then(JSON.parse)
}

export const TEAMS = await readDBFile('teams')
export const PRESIDENTS = await readDBFile('presidents')

export function writeDBFile (dbName, data) {
  return writeFile(
    `${DB_PATH}/${dbName}.json`,
    JSON.stringify(data, null, 2),
    'utf-8'
  )
}
