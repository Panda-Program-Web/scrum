import { Low } from 'lowdb'

import { adapter, createDefaultData } from '@/external/lowdb'

export const setupDataBase = async () => {
  const db = new Low(adapter, createDefaultData())
  await db.read()
  db.data = createDefaultData()
  await db.write()
  return { db }
}
