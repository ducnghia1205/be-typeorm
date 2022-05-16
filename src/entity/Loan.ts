import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./User";

@Entity()
export class Loan {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User

    @Column({
        type: "float",
        default: 0,
    })
    balance: number;

    @Column({
        type: "float",
        default: 0
    })
    remainingBalance: number;

    @Column()
    loanDocument: string;

    @Column({
        type: "float",
        default: 0
    })
    dailyInterestRate: number;

    @Column({
        default: true
    })
    available: boolean;

    @Column({
        type: 'timestamp without time zone', default: 'NOW()',
        nullable: true
    })
    loanEndDate: Date;

    @CreateDateColumn({type: 'timestamp without time zone', default: 'NOW()'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp without time zone', onUpdate: 'NOW()', nullable: true})
    updatedAt: Date;
}
