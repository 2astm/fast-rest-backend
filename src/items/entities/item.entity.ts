import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { UserEntity } from "../../users/entities/user.entity";

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Restaurant)
  public restaurant: Restaurant;

  @ManyToOne(() => UserEntity)
  public user: UserEntity;

  @Column()
  public title: string;

  @Column()
  public titleImage: string;

  @Column()
  public ingredients: string;

  @Column()
  public price: number;
}
