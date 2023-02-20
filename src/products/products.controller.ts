import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  async findProduct(@Param('id') id: string) {
    const product = await this.productsService.findProduct(id);
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }
}
