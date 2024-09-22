import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' }) 
  type!: string; 

  @Column({ type: 'text' }) 
  content!: string;

  @Column({ type: 'varchar', nullable: true }) 
  filePath?: string; 
}
