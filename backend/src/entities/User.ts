import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Client } from "./Client";
import { timeStamp } from "console";

export type UserRole = 'Admin' | 'Accountant' | 'Client';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Ensure you hash this before saving

  @Column({
    type: 'enum',
    enum: ['Admin', 'Accountant', 'Client'],
    default: 'Client',
  })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({nullable:true})
  reset_token?:string;

  @Column({type:'timestamp',nullable:true})
  reset_token_expiry?:Date;

  @OneToOne(() => Client, (client) => client.user, {
    cascade: true,
    eager: true,
  })
  client: Client;
}
