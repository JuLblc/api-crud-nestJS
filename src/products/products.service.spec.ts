import { HttpService, HttpModule } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiResponse, ProductsService } from './products.service';
import { Cache } from 'cache-manager';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpService: HttpService;
  let cacheManager: Cache;

  const mockProduct = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        ProductsService,
        {
          provide: CACHE_MANAGER,
          useValue: mockProduct,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    httpService = module.get<HttpService>(HttpService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findProduct', () => {
    const productId = '123';
    const expectedProduct = { code: productId, product_name: 'test product' };

    const apiResponse: AxiosResponse<ApiResponse> = {
      data: {
        product: expectedProduct,
      },
      status: 200,
      statusText: 'OK',
    } as AxiosResponse;

    it('should return product from cache if available', async () => {
      (cacheManager.get as jest.Mock).mockReturnValueOnce(expectedProduct);

      const actual = await service.findProduct(productId);

      expect(actual).toEqual(expectedProduct);
      expect(cacheManager.get).toBeCalledWith(productId);
    });

    it('should return product from API if not available in cache', async () => {
      (cacheManager.get as jest.Mock).mockReturnValueOnce(null);

      jest
        .spyOn(service['httpService'], 'get')
        .mockReturnValueOnce(of(apiResponse));

      const actual = await service.findProduct(productId);

      expect(actual).toEqual(expectedProduct);
      expect(cacheManager.get).toHaveBeenCalledWith(productId);
      expect(httpService.get).toHaveBeenCalledWith(
        `https://world.openfoodfacts.org/api/v0/product/${productId}.json`,
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        productId,
        expectedProduct,
        60 * 5 * 1000,
      );
    });

    it('should throw an error if product is not found', async () => {
      (cacheManager.get as jest.Mock).mockReturnValueOnce(null);

      jest.spyOn(service['httpService'], 'get').mockReturnValueOnce(null);

      await expect(service.findProduct(productId)).rejects.toThrow(
        'Unable to find product',
      );
    });
  });
});
