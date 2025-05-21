import { ProductName } from '@panda-project/core'

import { CreateProductCommand } from '@/application/use-case/product'

export class CreateProductCliCommand implements CreateProductCommand {
  constructor(private readonly productName: string) {}

  getProductName(): ProductName {
    return new ProductName(this.productName)
  }
}
