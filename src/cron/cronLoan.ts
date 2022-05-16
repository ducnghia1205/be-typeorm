import {getRepository, LessThan} from "typeorm";
import {Loan} from "../entity/Loan";
import * as moment from "moment";

export const closeLoan = async () => {
    const loanRepository = getRepository(Loan);

    const loans = await loanRepository.find({where: {available: true, loanEndDate: LessThan(moment())}});

    await Promise.all(loans.map(async loan => {
        loan.available = false;
        await loanRepository.save(loan);
    }));

    return;
}
