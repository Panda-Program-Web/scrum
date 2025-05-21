import { ProductName } from '@panda-project/core'

import { CreateProductCommand } from '@panda-project/use-case'

export class CreateProductCliCommand implements CreateProductCommand {
  constructor(private readonly productName: string) {}

  getProductName(): ProductName {
    return new ProductName(this.productName)
  }
}
