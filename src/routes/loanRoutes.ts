import { body, param } from "express-validator";
import {LoanController} from "../controller/LoanController";


export const LoanRoutes = [{
    method: "get",
    route: "/loans",
    controller: LoanController,
    action: "getAll",
    validation: [],
},{
    method: "get",
    route: "/loans/:id",
    controller: LoanController,
    action: "getDetail",
    validation: [
        param('id').isInt(),
    ],
}, {
    method: "post",
    route: "/loans",
    controller: LoanController,
    action: "createLoan",
    validation: [
        body('userId').isInt(),
        body('dailyInterestRate').isFloat().withMessage('dailyInterestRate must be a positive integer'),
        body('loanEndDate').notEmpty().isString(),
        body('balance').notEmpty().isInt({min: 1}).withMessage('balance must be a positive integer'),
        body('loanEndDate').notEmpty(),
    ],
},{
    method: "put",
    route: "/loans/:id",
    controller: LoanController,
    action: "updateLoan",
    validation: [
        param('id').isInt(),
        body('userId').isInt(),
        body('dailyInterestRate').isFloat().withMessage('dailyInterestRate must be a positive integer'),
        body('loanEndDate').notEmpty().isString(),
        body('balance').notEmpty().isInt({min: 1}).withMessage('balance must be a positive integer'),
        body('remainingBalance').notEmpty().isInt({min: 1}).withMessage('remainingBalance must be a positive integer'),
        body('loanEndDate').notEmpty(),
        body('loanDocument').notEmpty(),
    ],
},{
    method: "delete",
    route: "/loans/:id",
    controller: LoanController,
    action: "delete",
    validation: [
        param('id').isInt()
    ],
},
]
