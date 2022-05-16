import { createConnection } from "typeorm";
import * as request from 'supertest';
import app from "../src/app";
import {ormconfig} from "../ormconfig";

let connection;

const testUser = {
  firstName: 'John',
  lastName: 'Doe',
};

let idUserCreated;

beforeEach(async() => {
  connection = await createConnection(ormconfig);
  await connection.synchronize(false);
});

afterEach(() => {
  connection.close();
});

it('should be return users', async() => {
  const response = await request(app).get('/users');
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('message');
  expect(response.body).toHaveProperty('data');
});

it('should create a user', async() => {
  const response = await request(app).post('/users').send(testUser);
  idUserCreated = response.body.data.id;
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('message');
  expect(response.body).toHaveProperty('data');
});

it('should not create a user if no firstName is given', async() => {
  const response = await request(app).post('/users').send({ lastName: 'Doe'});
  expect(response.statusCode).toBe(400);
  expect(response.body.errors).not.toBeNull();
  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0]).toEqual({
    msg: 'Invalid value', param: 'firstName', location: 'body'
  });
});

it('should return a user with userId', async() => {
  const id = 1
  const response = await request(app).get(`/users/${id}`);
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(response.body)
});

it('should not return user with userId', async() => {
  const id = 'a'
  const response = await request(app).get(`/users/${id}`);
  expect(response.statusCode).toBe(400);
  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0]).toEqual({
    "value": "a",
    "msg": "Invalid value",
    "param": "id",
    "location": "params"
  });
});

it('should not remove user with userId', async() => {
  const id = 10000
  const response = await request(app).delete(`/users/${id}`);
  expect(response.statusCode).toBe(400);
  expect(response.text).toEqual(response.text);
});

it('should remove user with userId', async() => {
  const response = await request(app).delete(`/users/${idUserCreated}`);
  expect(response.statusCode).toBe(200);
});
