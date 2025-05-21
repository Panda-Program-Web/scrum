import { createDb, dbFileExists } from '@panda-project/gateway'
import { Command } from 'commander'

import { addAddDeveloperCommand, addRemoveDeveloperCommand } from '~/developer'
import { addAddEmployeeCommand, addEditEmployeeCommand, addRemoveEmployeeCommand } from '~/employee'
import { addInitCommand } from '~/init'
import { addCreateTeamCommand, addDisbandTeamCommand, addEditTeamCommand, addListTeamCommand } from '~/team'

const program = new Command()

type AddCommand = (program: Command) => void
const commands: AddCommand[] = [
  addInitCommand,
  // employee
  addAddEmployeeCommand,
  addEditEmployeeCommand,
  addRemoveEmployeeCommand,
  // team
  addCreateTeamCommand,
  addListTeamCommand,
  addEditTeamCommand,
  addDisbandTeamCommand,
  // developer
  addAddDeveloperCommand,
  addRemoveDeveloperCommand,
]

for (const command of commands) {
  command(program)
}

;(async () => {
  if (!dbFileExists()) {
    await createDb()
  }
})()

program.parse(process.argv)
