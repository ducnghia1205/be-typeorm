import {getConnection, getRepository} from "typeorm";
import {Transaction} from "../entity/Transaction";
import {NextFunction, Request, Response} from "express";
import {Loan} from "../entity/Loan";
import * as _ from 'lodash'
import * as moment from 'moment';

interface Error {
    message: string
}

export class TransactionController {
    private transactionRepository = getRepository(Transaction);
    private loanRepository = getRepository(Loan);

    validationDrawDown = (loan: Loan, transaction: Partial<Transaction>) => {
        let errors: Error[] = [];
        if (loan.available === false) {
            errors.push({message: `Loan not available. You can't create drawdown for now.`})
        }
        if (loan.remainingBalance === 0 || loan.loanEndDate < new Date()) {
            errors.push({message: `Current you can't drawdown, please repayment first.`})
        }
        if (loan.remainingBalance < transaction.amount) {
            errors.push({message: 'Amount must be less than remaining balance'})
        }
        if (moment(transaction.paymentDate).format('x') > moment().format('x')) {
            errors.push({message: `The payment date don't greater than today.`})
        }

        return errors
    }

    validationRepayment = (loan: Loan, transaction: Partial<Transaction>) => {
        let errors: Error[] = [];
        if (loan.remainingBalance === loan.balance) {
            errors.push({message: `You haven't drawdown for now.`})
        }
        if (loan.remainingBalance + transaction.amount > loan.balance) {
            errors.push({message: `You can't not repayment over balance.`})
        }

        return errors
    }

    makeDrawDown = async (loan: Loan, transaction: Partial<Transaction>, queryRunner) => {
        try {
            loan.remainingBalance = loan.remainingBalance - transaction.amount;
            transaction.remainingDebt = transaction.amount;
            transaction.amount = -transaction.amount;

            await Promise.all([
                await queryRunner.manager.save(Loan, loan),
                await queryRunner.manager.save(Transaction, transaction)
            ])

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    makeRepayment = async (loan: Loan, transaction: Partial<Transaction>, queryRunner) => {
        const transactions: Transaction[] = await this.transactionRepository.find({
            where: {loan: loan.id, type: 'drawdown'},
            order: {
                createdAt: 'ASC',
            }
        });

        try {
            let totalRepayment: number = _.cloneDeep(transaction.amount);

            let totalInterestRate: number = 0;
            transactions.map(tran => {
                let interestRate = (loan.dailyInterestRate /100) * Math.abs(tran.remainingDebt) * (moment().diff(moment(tran.paymentDate), 'days'));
                totalInterestRate += interestRate;
            });

            totalRepayment = totalRepayment - totalInterestRate;
            const totalRepaymentUpdatedLoan = _.cloneDeep(transaction.amount) - totalInterestRate;

            transactions.map(async t => {
                if (totalRepayment > 0) {
                    if ((t.remainingDebt > totalRepayment) || (t.remainingDebt === totalRepayment)) {
                        t.remainingDebt -= totalRepayment;
                        totalRepayment = 0;
                    } else {
                        t.remainingDebt = 0;
                        totalRepayment -= t.remainingDebt;
                    }
                    await queryRunner.manager.save(Transaction, t);
                }
            })

            loan.remainingBalance = loan.remainingBalance + totalRepaymentUpdatedLoan;
            await Promise.all([
                await queryRunner.manager.save(Loan, loan),
                await queryRunner.manager.save(Transaction, transaction)
            ]);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const transactions: Transaction[] = await this.transactionRepository.find();

            return res.status(200).json({message: 'Success', data: transactions})
        } catch (err) {
            return res.status(500).json({message: err});
        }
    }

    async getDetail(req: Request, res: Response, next: NextFunction) {
        try {
            const transaction: Transaction = await this.transactionRepository.findOne(req.params.id);

            return res.status(200).json({message: 'Success', data: transaction})
        } catch (err) {
            return res.status(500).json({message: err});
        }
    }

    async getTransactionsWithLoanId(req: Request, res: Response, next: NextFunction) {
        try {
            const transactions: Transaction[] = await this.transactionRepository.find({
                where: {loan: req.params.loanId},
                relations: ['loan']
            });

            return res.status(200).json({message: 'Success', data: transactions})
        } catch (err) {
            return res.status(500).json({message: err});
        }
    }

    async createTransaction(req: Request, res: Response, next: NextFunction) {
        try {
            const transaction: Partial<Transaction> = {
                type: req.body.type,
                amount: req.body.amount,
                loan: req.body.loan,
                paymentDate: req.body.paymentDate ? req.body.paymentDate : new Date()
            }

            const loan: Loan = await this.loanRepository.findOne(transaction.loan);
            if (!loan) {
                return res.status(400).json({message: 'Loan does not exist.'})
            }

            const connection = getConnection();
            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            let errors: Error[] = []
            switch (transaction.type) {
                case 'drawdown':
                    errors = this.validationDrawDown(loan, transaction);
                    if (errors.length) {
                        return res.status(400).json({errors: errors});
                    }
                    await this.makeDrawDown(loan, transaction, queryRunner);
                    break;
                case 'repayment':
                    errors = this.validationRepayment(loan, transaction);
                    if (errors.length) {
                        return res.status(400).json({errors: errors});
                    }
                    await this.makeRepayment(loan, transaction, queryRunner);
                    break;
            }

            return res.status(200).json({message: 'Success', data: transaction})
        } catch (err) {
            return res.status(500).json({message: err});
        }
    }
}




