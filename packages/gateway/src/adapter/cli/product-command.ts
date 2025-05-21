import { CreateProductCommand, ProductName } from '@panda-project/core'

export class CreateProductCliCommand implements CreateProductCommand {
  constructor(private readonly productName: string) {}

  getProductName(): ProductName {
    return new ProductName(this.productName)
  }
}
