import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: '' })
  type: string;

  @Column({ default: 0 })
  price: number;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  picture: string;
}
