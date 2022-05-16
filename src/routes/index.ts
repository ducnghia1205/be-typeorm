import {UserRoutes} from "./userRoutes";
import {LoanRoutes} from "./loanRoutes";
import {TransactionRoutes} from "./transactionRoutes";

export const Routes = [
    ...UserRoutes,
    ...LoanRoutes,
    ...TransactionRoutes
];
