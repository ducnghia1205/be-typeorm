import { body, param } from "express-validator";
import {TransactionController} from "../controller/TransactionController";


export const TransactionRoutes = [{
    method: "get",
    route: "/transactions",
    controller: TransactionController,
    action: "getAll",
    validation: [],
},{
    method: "get",
    route: "/transactions/:id",
    controller: TransactionController,
    action: "getDetail",
    validation: [
        param('id').isInt()
    ],
},{
    method: "get",
    route: "/transactions/loan/:loanId",
    controller: TransactionController,
    action: "getTransactionsWithLoanId",
    validation: [
        param('loanId').isInt()
    ],
},{
    method: "post",
    route: "/transactions",
    controller: TransactionController,
    action: "createTransaction",
    validation: [
        body('loanId').notEmpty().isInt(),
        body('amount').notEmpty().isFloat({min: 1}).withMessage('amount should be positive.'),
        body('type').notEmpty().isString().isIn(['drawdown', 'repayment']).withMessage('invalid type')
    ],
},]
