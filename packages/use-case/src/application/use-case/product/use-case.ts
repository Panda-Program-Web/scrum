import { CreateProductCommand, Product, ProductId, ProductRepositoryInterface } from '@panda-project/core'

import { ProductRepository } from '@panda-project/gateway'

export class ProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryInterface = new ProductRepository()) {}

  async create(command: CreateProductCommand) {
    const product = new Product(ProductId.createAsNull(), command.getProductName())
    return await this.productRepository.save(product)
  }

  async exists(): Promise<boolean> {
    return await this.productRepository.existsWithoutId()
  }
}
