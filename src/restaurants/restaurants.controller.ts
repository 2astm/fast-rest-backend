import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Auth } from '../authentification/decorators/auth.decorator';
import { UserRolesEnum } from '../users/enums/user-roles.enum';
import { UserEntity } from '../users/entities/user.entity';
import { User } from '../authentification/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileStorage } from '../helpers/file.helper';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { OptionalAuth } from '../authentification/decorators/optional-auth.decorator';
import { Restaurant } from './entities/restaurant.entity';

@Controller('restaurants')
export class RestaurantsController {
  private logger = new Logger('RestaurantsController');

  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @Auth(UserRolesEnum.OWNER)
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'titleImage' })
  @UseInterceptors(
    FileInterceptor('titleImage', {
      storage: FileStorage('restaurantStorage'),
    }),
  )
  @ApiOkResponse({ type: Restaurant })
  create(
    @User() user: UserEntity,
    @Body() createRestaurantDto: CreateRestaurantDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.logger.debug(`Create restaurant: ${createRestaurantDto.title}`);
    return this.restaurantsService.create(createRestaurantDto, user, file);
  }

  @Get()
  @OptionalAuth()
  @ApiOkResponse({ type: [Restaurant] })
  findAll(@User() user: UserEntity) {
    this.logger.debug(`Find all`);
    return this.restaurantsService.findAll(user);
  }

  @Get(':id')
  @OptionalAuth()
  findOne(@Param('id') id: string, @User() user: UserEntity) {
    this.logger.debug(`Get restaurant by id: ${id}`);
    return this.restaurantsService.findOne(id, user);
  }

  @Patch(':id')
  @Auth(UserRolesEnum.OWNER, UserRolesEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @User() user: UserEntity,
  ) {
    this.logger.debug(`Update restaurant by id: ${id}`);
    const restId = Number(id);
    if (!Number.isInteger(restId))
      throw new BadRequestException('id should be an integer');
    return this.restaurantsService.update(restId, updateRestaurantDto, user);
  }

  @Delete(':id')
  @Auth(UserRolesEnum.OWNER)
  remove(@Param('id') id: string, @User() user: UserEntity) {
    this.logger.debug(`Delete restaurant by id: ${id}`);
    const restId = Number(id);
    if (!Number.isInteger(restId))
      throw new BadRequestException('id should be an integer');
    return this.restaurantsService.remove(restId, user);
  }
}
