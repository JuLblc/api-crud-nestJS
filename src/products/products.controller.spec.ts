import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProductsService = {
    findProduct: jest.fn((id) => {
      return {
        _id: id,
        _keywords: ['aptonia'],
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    })
      .overrideProvider(ProductsService)
      .useValue(mockProductsService)
      .compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('[FIND_ONE] should be defined', async () => {
    const id = '000000652734';
    const expected = {
      _id: '000000652734',
      _keywords: ['aptonia'],
    };

    const actual = await controller.findProduct(id);

    expect(actual).toEqual(expected);

    expect(mockProductsService.findProduct).toHaveBeenCalledWith(id);
  });
});
