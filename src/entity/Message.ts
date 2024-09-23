import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  type!: string; // Тип повідомлення (text, file тощо)

  @Column({ type: 'text' })
  content!: string; // Вміст повідомлення

  @Column({ type: 'varchar', nullable: true })
  filePath!: string;
}
