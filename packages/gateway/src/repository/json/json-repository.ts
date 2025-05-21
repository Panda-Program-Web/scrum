export class JsonRepository {
  protected calculateNewId(records: any[]): number {
    // 空の時
    if (records.length === 0) {
      return records.length + 1
    }

    // 欠番がある時の対応
    const lastRecord = records.at(records.length - 1)
    if (lastRecord?.id) {
      return lastRecord.id + 1
    }

    throw new Error('id が判定できません')
  }
}
