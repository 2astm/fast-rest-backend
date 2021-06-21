import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { UserEntity } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Repository } from 'typeorm';
import { RestaurantStatusEnum } from './enums/restaurant-status.enum';
import { UserRolesEnum } from '../users/enums/user-roles.enum';

@Injectable()
export class RestaurantsService {
  private logger = new Logger('RestaurantsService');

  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(
    createRestaurantDto: CreateRestaurantDto,
    user: UserEntity,
    file: Express.Multer.File,
  ) {
    this.logger.debug(`create: ${createRestaurantDto.title}`);
    const restaurant = <Restaurant>{
      user: { id: user.id },
      address: createRestaurantDto.address,
      title: createRestaurantDto.title,
      lat: createRestaurantDto.lat,
      lng: createRestaurantDto.lng,
      titleImage: file ? file.path : null,
      status: RestaurantStatusEnum.PENDING,
    };
    return this.restaurantRepository.save(restaurant);
  }

  findAll(user: UserEntity) {
    if (user && user.role == UserRolesEnum.ADMIN)
      return this.restaurantRepository.find();
    else
      return this.restaurantRepository.find({
        where: [
          { status: RestaurantStatusEnum.APPROVED },
          { user: { id: user ? user.id : -1 } },
        ],
      });
  }

  async findOne(id: string, user: UserEntity) {
    const restId = Number(id);
    if (!Number.isInteger(restId))
      throw new BadRequestException('id should be an integer');
    try {
      if (user && user.role == UserRolesEnum.ADMIN)
        return await this.restaurantRepository.findOneOrFail({
          where: { id: restId },
        });
      else
        return await this.restaurantRepository.findOneOrFail({
          where: [
            { id: restId, status: RestaurantStatusEnum.APPROVED },
            {
              id: restId,
              user: { id: user ? user.id : -1 },
            },
          ],
        });
    } catch (err) {
      this.logger.error(`find one: ${id} error: ${err}`);
      throw new NotFoundException('Restaurant not found');
    }
  }

  async update(
    id: number,
    updateRestaurantDto: UpdateRestaurantDto,
    user: UserEntity,
  ) {
    const res = await this.restaurantRepository.update(
      { id, user },
      updateRestaurantDto,
    );
    if (res && res.affected != 0) return 'Successful';
    else throw new NotFoundException();
  }

  async remove(id: number, user: UserEntity) {
    const res = await this.restaurantRepository.softRemove({ id, user });
    if (res && res.deletedDate) return 'Successful';
    else throw new NotFoundException();
  }
}
