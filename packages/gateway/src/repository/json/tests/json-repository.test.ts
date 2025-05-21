import { JsonRepository } from '../json-repository'

class ConcreteRepository extends JsonRepository {
  calculateNewIdForTest(records: any[]) {
    return super.calculateNewId(records)
  }
}

describe('JsonRepository', () => {
  describe('calculateNewId', () => {
    const concreteRepository = new ConcreteRepository()

    it('最初のID は 1 を返す', () => {
      const records = []
      const result = concreteRepository.calculateNewIdForTest(records)
      expect(result).toBe(1)
    })

    it('欠番がない時は最大値 + 1 を返す', () => {
      const records = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const result = concreteRepository.calculateNewIdForTest(records)
      expect(result).toBe(4)
    })

    it('欠番がある時も最大値 + 1 を返す', () => {
      const records = [{ id: 1 }, { id: 2 }, { id: 9 }]
      const result = concreteRepository.calculateNewIdForTest(records)
      expect(result).toBe(10)
    })
  })
})
