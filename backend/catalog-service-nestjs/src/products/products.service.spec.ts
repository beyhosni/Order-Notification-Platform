import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
    let service: ProductsService;
    let repository: Repository<Product>;

    const mockProductRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getRepositoryToken(Product),
                    useValue: mockProductRepository,
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        repository = module.get<Repository<Product>>(getRepositoryToken(Product));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a product', async () => {
            const createDto = {
                name: 'Test Product',
                description: 'Test',
                price: 99.99,
                category: 'Electronics',
            };

            const mockProduct = { id: '1', ...createDto };
            mockProductRepository.create.mockReturnValue(mockProduct);
            mockProductRepository.save.mockResolvedValue(mockProduct);

            const result = await service.create(createDto);

            expect(result).toEqual(mockProduct);
            expect(mockProductRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockProductRepository.save).toHaveBeenCalledWith(mockProduct);
        });
    });

    describe('findAll', () => {
        it('should return an array of products', async () => {
            const mockProducts = [
                { id: '1', name: 'Product 1', price: 10 },
                { id: '2', name: 'Product 2', price: 20 },
            ];

            mockProductRepository.find.mockResolvedValue(mockProducts);

            const result = await service.findAll();

            expect(result).toEqual(mockProducts);
            expect(mockProductRepository.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a product', async () => {
            const mockProduct = { id: '1', name: 'Product 1', price: 10 };
            mockProductRepository.findOne.mockResolvedValue(mockProduct);

            const result = await service.findOne('1');

            expect(result).toEqual(mockProduct);
        });

        it('should throw NotFoundException when product not found', async () => {
            mockProductRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
        });
    });
});
