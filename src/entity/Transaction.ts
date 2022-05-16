import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn, ManyToOne
} from "typeorm";
import {Loan} from "./Loan";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: ['drawdown', 'repayment']
    })
    type: string;

    @Column({
        type: "float",
        default: 0,
        readonly: true
    })
    amount: number;

    @Column({
        type: "float",
        default: 0,
    })
    remainingDebt: number;

    @ManyToOne(() => Loan)
    @JoinColumn()
    loan: Loan

    @CreateDateColumn({ type: 'timestamp without time zone', default: 'NOW()' })
    paymentDate: Date;

    @CreateDateColumn({ type: 'timestamp without time zone', default: 'NOW()' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp without time zone', onUpdate: 'NOW()', nullable: true })
    updatedAt: Date;
}
