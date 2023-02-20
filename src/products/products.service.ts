import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(private httpService: HttpService) {}

  async findProduct(id: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `https://world.openfoodfacts.org/api/v0/product/${id}.json`,
        ),
      );

      return response.data.product;
    } catch (error) {
      throw new Error('Unable to find product');
    }
  }
}
