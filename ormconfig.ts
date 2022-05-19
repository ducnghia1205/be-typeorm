import {ConnectionOptions} from "typeorm";
import {join} from "path";
import {config} from 'dotenv';
config();

const port: number = Number(process.env.PORT);
const databasePort: number = Number(process.env.DB_PORT);
const databaseHost: string = process.env.DB_HOST;
const username: string = process.env.DB_USERNAME;
const password: string = process.env.DB_PASSWORD;
const databaseName: string = process.env.DB_NAME;

export const ormconfig: ConnectionOptions = {
   "type": "postgres",
   "host": databaseHost,
   "port": databasePort,
   "username": username,
   "password": password,
   "database": databaseName,
   "synchronize": true,
   "logging": false,
   "entities": [
      join(__dirname, 'src/entity/*.{ts,js}'),
   ],
   "migrations": [
      join(__dirname, 'src/migration/*.{ts,js}'),
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}

export default port; 
