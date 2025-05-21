import { input } from '@inquirer/prompts'
import { InitCliCommand } from '@panda-project/gateway'
import { InitScenario } from '@panda-project/use-case'
import { Command } from 'commander'

export const addInitCommand = (program: Command) => {
  program
    .command('init')
    .description('最初の設定をします')
    .action(async () => {
      const useInput = async () => {
        const productName = await input({
          message: '開発するプロダクトの名前は？',
        })
        const projectName = await input({ message: 'プロジェクト名は？' })
        return { productName, projectName }
      }

      console.info('最初の設定を開始します')
      try {
        const { productName, projectName } = await useInput()
        const command = new InitCliCommand(productName, projectName)
        await new InitScenario().exec(command)
        console.info('初期設定を完了しました')
      } catch (e: any) {
        console.error(e?.message)
      }
    })
}
