import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { username, password, profile } = createUserDto;
      const hashPass = await bcrypt.hash(password, 8);
      const data = this.userRepo.create({
        username: username,
        password: hashPass,
        profile: profile,
      });
      return await this.userRepo.save(data);
    } catch (error) {
      throw new HttpException(
        { casue: 'cannot create user.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      return this.userRepo.findOneByOrFail({ id });
    } catch (error) {
      throw new HttpException(
        { cause: 'user not found' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return await this.userRepo.findOneByOrFail({ username: username });
  }
}
