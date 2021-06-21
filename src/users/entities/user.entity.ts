import { BaseEntity, Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { UserRolesEnum } from '../enums/user-roles.enum';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text', nullable: true, unique: true })
  public email: string;

  @Column({ nullable: true })
  public name: string;

  @Column({ nullable: true })
  public surname: string;

  @Generated('uuid')
  public uuid: string;

  @Column({ enum: UserRolesEnum })
  public role: UserRolesEnum;

  @Column({ type: 'text', nullable: true })
  @Exclude({ toPlainOnly: true })
  public password: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  public salt: string;

  async validatePassword(password: string) {
    const hash = await bcrypt.hash(password, this.salt);
    return hash == this.password;
  }
}
