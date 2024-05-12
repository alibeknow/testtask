import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm'

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    username: string

    @Column({unique: true, length: 42})
    address: string

    @Column()
    role: string

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date
}
