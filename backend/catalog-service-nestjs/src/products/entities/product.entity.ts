import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
    @ApiProperty({ description: 'Product ID (UUID)' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Product name' })
    @Column()
    name: string;

    @ApiProperty({ description: 'Product description' })
    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiProperty({ description: 'Product price' })
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ApiProperty({ description: 'Product category' })
    @Column()
    category: string;

    @ApiProperty({ description: 'Product image URL', required: false })
    @Column({ nullable: true })
    imageUrl: string;

    @ApiProperty({ description: 'Creation timestamp' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    @UpdateDateColumn()
    updatedAt: Date;
}
