import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import { AxiosResponse } from 'axios';
interface Product {
  code: string;
  product_name?: string;
  brands?: string;
  categories?: string;
  categories_tags?: string[];
  categories_hierarchy?: string[];
  image_front_url?: string;
  image_ingredients_url?: string;
  image_nutrition_url?: string;
  ingredients_text?: string;
  ingredients_tags?: string[];
  nutrition_grades?: string;
  nutriments?: {
    energy_value?: number;
    energy_unit?: string;
    fat_100g?: number;
    saturated_fat_100g?: number;
    carbohydrates_100g?: number;
    sugars_100g?: number;
    fiber_100g?: number;
    proteins_100g?: number;
    salt_100g?: number;
    sodium_100g?: number;
  };
}

export type ApiResponse = {
  product: Product;
};
@Injectable()
export class ProductsService {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findProduct(id: string): Promise<Product> {
    try {
      const productFromCache: Product = await this.cacheManager.get(id);

      if (productFromCache) {
        console.log('from cache');
        return productFromCache;
      }

      const responseFromAPI: AxiosResponse<ApiResponse> = await lastValueFrom(
        this.httpService.get(
          `https://world.openfoodfacts.org/api/v0/product/${id}.json`,
        ),
      );

      await this.cacheManager.set(
        id,
        responseFromAPI.data.product,
        60 * 5 * 1000, // 5 Minutes
      );

      console.log('from API');
      return responseFromAPI.data.product;
    } catch (error) {
      throw new Error('Unable to find product');
    }
  }
}
