import { CreateProductCommand, CreateProjectCommand } from '@/scrum'

export interface InitCommand {
  getCreateProductCommand(): CreateProductCommand
  getCreateProjectCommand(): CreateProjectCommand
}
