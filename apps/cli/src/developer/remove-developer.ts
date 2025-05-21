import { confirm, select } from '@inquirer/prompts'
import { RemoveDeveloperCliCommand } from '@panda-project/gateway'
import { RemoveDeveloperQueryService, RemoveDeveloperQueryServiceDto, ScrumTeamUseCase } from '@panda-project/use-case'
import { Command } from 'commander'

type SelectDeveloper = (arg: RemoveDeveloperQueryServiceDto['developers']) => Promise<{ developerId: number }>

// developer remove. loop で複数 select + confirm で抜ける
export const addRemoveDeveloperCommand = (program: Command) => {
  program
    .command('remove-developer')
    .description('スクラムチームから開発者を除外します')
    .action(async () => {
      const selectDeveloper: SelectDeveloper = async (developers) => {
        const developerId = await select({
          message: 'チームから除外する開発者を選択してください',
          choices: developers.map((v) => ({
            name: `${v.id}: ${v.name}`,
            value: v.id,
          })),
        })
        return { developerId }
      }
      const continueToSelect = async () => await confirm({ message: '他の開発者を除外しますか？' })

      try {
        let shouldContinueLoop = true
        const i = 0

        while (shouldContinueLoop) {
          // ユーザー入力に基づいてループを終了する条件
          if (i >= 1 && !(await continueToSelect())) {
            shouldContinueLoop = false
            break
          }

          const { developers } = await new RemoveDeveloperQueryService().exec()
          const { developerId } = await selectDeveloper(developers)
          const command = new RemoveDeveloperCliCommand(developerId)
          await new ScrumTeamUseCase().removeDeveloper(command)
        }
      } catch (e: any) {
        console.error(e?.message)
      }
    })
}
