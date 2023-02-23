import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guard/authenticated.guard';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async findProduct(@Param('id') id: string): Promise<any> {
    const product = await this.productsService.findProduct(id);
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }
}
