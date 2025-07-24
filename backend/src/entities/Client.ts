import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Client {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => User, (user) => user.client, {
    onDelete: 'CASCADE',// Shared primary key
  })

  @JoinColumn({ name: 'id' }) // client.id = user.id
  user: User;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  contact_info: string;
}
