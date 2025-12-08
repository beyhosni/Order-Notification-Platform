import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../src/products/entities/product.entity';
import { Repository } from 'typeorm';

describe('ProductsController (e2e)', () => {
    let app: INestApplication;
    let productRepository: Repository<Product>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        productRepository = moduleFixture.get<Repository<Product>>(
            getRepositoryToken(Product),
        );
    });

    beforeEach(async () => {
        await productRepository.clear();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/api/products (POST)', () => {
        it('should create a product', () => {
            return request(app.getHttpServer())
                .post('/api/products')
                .send({
                    name: 'Test Product',
                    description: 'Test Description',
                    price: 99.99,
                    category: 'Electronics',
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body.name).toBe('Test Product');
                    expect(res.body.price).toBe(99.99);
                });
        });

        it('should validate required fields', () => {
            return request(app.getHttpServer())
                .post('/api/products')
                .send({
                    name: 'Test',
                })
                .expect(400);
        });
    });

    describe('/api/products (GET)', () => {
        it('should return all products', async () => {
            await productRepository.save([
                { name: 'Product 1', price: 10, category: 'Cat1', description: 'Desc1' },
                { name: 'Product 2', price: 20, category: 'Cat2', description: 'Desc2' },
            ]);

            return request(app.getHttpServer())
                .get('/api/products')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveLength(2);
                });
        });
    });

    describe('/api/products/:id (GET)', () => {
        it('should return a product by id', async () => {
            const product = await productRepository.save({
                name: 'Test Product',
                price: 99.99,
                category: 'Electronics',
                description: 'Test',
            });

            return request(app.getHttpServer())
                .get(`/api/products/${product.id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.name).toBe('Test Product');
                });
        });

        it('should return 404 for non-existent product', () => {
            const fakeId = '123e4567-e89b-12d3-a456-426614174000';
            return request(app.getHttpServer())
                .get(`/api/products/${fakeId}`)
                .expect(404);
        });
    });

    describe('/api/products/search (GET)', () => {
        it('should search products', async () => {
            await productRepository.save([
                { name: 'Laptop', price: 1000, category: 'Electronics', description: 'Gaming laptop' },
                { name: 'Mouse', price: 50, category: 'Electronics', description: 'Wireless mouse' },
            ]);

            return request(app.getHttpServer())
                .get('/api/products/search?query=laptop')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveLength(1);
                    expect(res.body[0].name).toBe('Laptop');
                });
        });
    });
});
