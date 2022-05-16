import {getRepository} from "typeorm";
import {Loan} from "../entity/Loan";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";

export class LoanController {
    private loanRepository = getRepository(Loan)
    private userRepository = getRepository(User)

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const loanList: Loan[] = await this.loanRepository.find({relations: ['user'], order: {id: 'ASC'}});

            return res.status(200).json({message: 'Success', data: loanList})
        } catch (err) {
            return res.status(500).json({message: err});
        }
    }

    async getDetail(req: Request, res: Response, next: NextFunction) {
        try {
            const loan: Loan = await this.loanRepository.findOne({where: {id: req.params.id}, relations: ['user']});

            return res.status(200).json({message: 'Success', data: loan})
        } catch (err) {
            return res.status(500).json({message: err});
        }
    }

    async createLoan(req: Request, res: Response, next: NextFunction) {
        try {
            const data: Partial<Loan> = {
                user: req.body.user,
                loanDocument: req.body.loanDocument,
                dailyInterestRate: req.body.dailyInterestRate,
                loanEndDate: req.body.loanEndDate,
                balance: req.body.balance,
                remainingBalance: req.body.balance
            }

            const user: User = await this.userRepository.findOne({where: {id: data.user}});
            if (!user) {
                return res.status(400).json({message: 'user does not exist.'})
            }

            const loan: Loan = await this.loanRepository.save(data);

            return res.status(200).json({message: 'Success', data: loan});
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    async updateLoan(req: Request, res: Response, next: NextFunction) {
        try {
            const loan: Loan = await this.loanRepository.findOne(req.params.id);
            if (!loan) {
                return res.status(400).json({message: 'Loan does not exist.'});
            }

            const user: User = await this.userRepository.findOne(req.body.user);
            if (!user) {
                return res.status(400).json({message: 'User does not exist.'});
            }

            loan.balance = req.body.balance;
            loan.remainingBalance = req.body.remainingBalance;
            loan.user = req.body.user;
            loan.loanEndDate = req.body.loanEndDate;
            loan.dailyInterestRate = req.body.dailyInterestRate;
            loan.loanDocument = req.body.loanDocument;

            await this.loanRepository.save(loan);

            return res.status(200).json({message: 'Success'});
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const loanToRemove = await this.loanRepository.findOne(req.params.id);
            if (!loanToRemove) return res.status(400).json({message: 'Loan not found'});

            await this.loanRepository.remove(loanToRemove);

            return res.status(200).json({ message: 'Success'});
        } catch (err) {
            return res.status(500).json({message: err});
        }
    }
}
