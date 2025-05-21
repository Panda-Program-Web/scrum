export * from './employee'
export * from './employee/command'

export class Company {}

export class Department {
  constructor(public readonly name: string) {}
}
