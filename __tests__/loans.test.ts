import { createConnection } from "typeorm";
import * as request from 'supertest';
import app from "../src/app";
import * as console from "console";
import {ormconfig} from "../ormconfig";

let connection;

const testLoan = {
    "balance": 20000,
    "user": 1,
    "loanDocument": "testLoan",
    "dailyInterestRate": "0.1",
    "loanEndDate": "2022-04-19T08:06:10.521Z",
    "remainingBalance": 10000
}

let idLoanCreated;

beforeEach(async() => {
    connection = await createConnection(ormconfig);
    await connection.synchronize(false);
});

afterEach(() => {
    connection.close();
});

it('should be no return list loan', async() => {
    const response = await request(app).get('/loans');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
});

it('should create a loan', async() => {
    const response = await request(app).post('/loans').send(testLoan);
    idLoanCreated = response.body.data.id;
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
});


it('should return a loan with loanId', async() => {
    const response = await request(app).get(`/loans/${idLoanCreated}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(response.body)
});

it('should return 400 when update a loan with loanId', async () => {
    testLoan.balance = 200000;
    testLoan.dailyInterestRate = '10';
    delete testLoan.remainingBalance
    const response = await request(app).put(`/loans/${idLoanCreated}`).send(testLoan);
    expect(response.statusCode).toBe(400);
    expect(response.body.errors.length).toBe(2);
    expect(response.body.errors[0]).toEqual({
        msg: 'Invalid value',
        param: 'remainingBalance',
        location: 'body'
    });
})

it('should return 200 when update a loan with loanId', async () => {
    testLoan.balance = 200000;
    testLoan.dailyInterestRate = '10';
    testLoan.remainingBalance = 200000;
    const response = await request(app).put(`/loans/${idLoanCreated}`).send(testLoan);
    console.log('response' , response.body)
    expect(response.statusCode).toBe(200);
})


it('should delete a loan', async() => {
    const response = await request(app).delete(`/loans/${idLoanCreated}`);
    expect(response.statusCode).toBe(200);
});
