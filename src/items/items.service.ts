import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class ItemsService {
  private logger = new Logger('ItemsService');

  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}

  async create(
    user: UserEntity,
    createItemDto: CreateItemDto,
    file: Express.Multer.File,
  ) {
    const item = <Item>{
      restaurant: { id: createItemDto.restaurantId },
      title: createItemDto.title,
      ingredients: createItemDto.ingredients,
      price: createItemDto.price,
      titleImage: file ? file.path : null,
    };
    return await this.itemRepository.save(item).catch((err) => {
      this.logger.error(`Create: ${err}`);
      throw new NotFoundException('Rest not found');
    });
  }

  findAll(restId: number) {
    return this.itemRepository.find({ restaurant: { id: restId } });
  }

  findOne(id: number) {
    return this.itemRepository.find({ id }).catch((err) => {
      this.logger.error(`findOne ${id}`);
      throw new NotFoundException('Item not found');
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto, user: UserEntity) {
    const res = await this.itemRepository.update({ id, user }, updateItemDto);
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
