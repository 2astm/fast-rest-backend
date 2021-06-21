import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { RestaurantStatusEnum } from '../enums/restaurant-status.enum';

@Entity()
export class Restaurant extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => UserEntity)
  public user: UserEntity;

  @Column()
  public title: string;

  @Column()
  public address: string;

  @Column()
  public lat: number;

  @Column()
  public lng: number;

  @Column({ nullable: true })
  public titleImage: string;

  @Column({ enum: RestaurantStatusEnum })
  public status: RestaurantStatusEnum;

  @DeleteDateColumn()
  public deletedDate: Date;
}
