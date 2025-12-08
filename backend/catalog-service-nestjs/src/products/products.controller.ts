import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@ApiTags('products')
@Controller('api/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully', type: Product })
    create(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'List of all products', type: [Product] })
    findAll(): Promise<Product[]> {
        return this.productsService.findAll();
    }

    @Get('search')
    @ApiOperation({ summary: 'Search products by name or description' })
    @ApiQuery({ name: 'query', required: true, description: 'Search query' })
    @ApiResponse({ status: 200, description: 'List of matching products', type: [Product] })
    search(@Query('query') query: string): Promise<Product[]> {
        return this.productsService.search(query);
    }

    @Get('category/:category')
    @ApiOperation({ summary: 'Get products by category' })
    @ApiResponse({ status: 200, description: 'List of products in category', type: [Product] })
    findByCategory(@Param('category') category: string): Promise<Product[]> {
        return this.productsService.findByCategory(category);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a product by ID' })
    @ApiResponse({ status: 200, description: 'Product details', type: Product })
    @ApiResponse({ status: 404, description: 'Product not found' })
    findOne(@Param('id') id: string): Promise<Product> {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a product' })
    @ApiResponse({ status: 200, description: 'Product updated successfully', type: Product })
    @ApiResponse({ status: 404, description: 'Product not found' })
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ): Promise<Product> {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a product' })
    @ApiResponse({ status: 200, description: 'Product deleted successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    remove(@Param('id') id: string): Promise<void> {
        return this.productsService.remove(id);
    }
}
