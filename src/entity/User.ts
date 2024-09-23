import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true }) 
  login!: string;

  @Column({ type: 'varchar' }) 
  passwordHash!: string;

  @Column({ type: 'varchar', nullable: true })
  filePath!: string; // Переконайся, що тип є рядком
}
