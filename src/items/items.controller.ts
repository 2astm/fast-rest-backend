import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Auth } from '../authentification/decorators/auth.decorator';
import { UserRolesEnum } from '../users/enums/user-roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileStorage } from '../helpers/file.helper';
import { UserEntity } from '../users/entities/user.entity';
import { User } from '../authentification/decorators/user.decorator';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @Auth(UserRolesEnum.OWNER)
  @UseInterceptors(
    FileInterceptor('titleImage', {
      storage: FileStorage('restaurantStorage'),
    }),
  )
  create(
    @User() user: UserEntity,
    @Body() createItemDto: CreateItemDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.itemsService.create(user, createItemDto, file);
  }

  @Get()
  findAll(@Query('rest-id') restId: number) {
    if (!Number.isInteger(restId))
      throw new BadRequestException('rest-id should be an integer');
    return this.itemsService.findAll(restId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Patch(':id')
  @Auth(UserRolesEnum.OWNER)
  update(
    @Param('id') id: number,
    @Body() updateItemDto: UpdateItemDto,
    @User() user: UserEntity,
  ) {
    if (!Number.isInteger(id))
      throw new BadRequestException('rest-id should be an integer');
    return this.itemsService.update(id, updateItemDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
