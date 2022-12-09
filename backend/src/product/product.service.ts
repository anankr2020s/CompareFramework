import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private pdRepo: Repository<Product>,
  ) {}
  create(createProductDto: CreateProductDto): Promise<Product> {
    return this.pdRepo.save(createProductDto);
  }

  findAll(): Promise<Product[]> {
    return this.pdRepo.find();
  }

  async findOne(id: number): Promise<Product> {
    try {
      return await this.pdRepo.findOneByOrFail({ id });
    } catch (error) {
      throw new HttpException(
        { cause: 'product not found' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.findOne(id);
      const { name, type, price, description, picture } = updateProductDto;
      if (name) product.name = name;
      if (type) product.type = type;
      if (price) product.price = price;
      if (description) product.description = description;
      if (picture) product.picture = picture;
      return await this.pdRepo.save(product);
    } catch (error) {
      throw new HttpException({ cause: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const product = await this.findOne(id);
      return await this.pdRepo.delete(id);
    } catch (error) {
      throw new HttpException({ cause: error }, HttpStatus.BAD_REQUEST);
    }
  }
}
