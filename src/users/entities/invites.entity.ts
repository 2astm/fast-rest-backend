import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('invites')
export class InvitesEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public surname: string;

  @Column()
  public email: string;

  @Column()
  public expiredAt: Date;
}
