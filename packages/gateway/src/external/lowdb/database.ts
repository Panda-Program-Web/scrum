import fs from 'node:fs'

import { Adapter, Low, Memory } from 'lowdb'
import { JSONFile } from 'lowdb/node'

import { DataBase, createDefaultData } from './schema'

const isTest = process.env.NODE_ENV === 'test'

const dirname = isTest ? '/mock/path' : __dirname
const cliPathIndex = dirname.indexOf('/apps/cli')
const webPathIndex = dirname.indexOf('/apps/web')

if (cliPathIndex === -1 && webPathIndex === -1 && !isTest) {
  throw new Error('DB path not found')
}

const rootIndex = cliPathIndex > 0 ? cliPathIndex : webPathIndex
const basePath = dirname.slice(0, rootIndex)
const dbFilePath = `${basePath}/db.json`

const adapter: Adapter<DataBase> = isTest ? new Memory<DataBase>() : new JSONFile<DataBase>(dbFilePath)
const db = new Low<DataBase>(adapter, createDefaultData())
const dbFileExists = () => fs.existsSync(dbFilePath)

const createDb = async () => {
  await db.write()
}

const resetDb = async () => {
  const newDb = new Low<DataBase>(adapter, createDefaultData())
  await newDb.write()
}

export { adapter, createDb, db, dbFileExists, resetDb }
