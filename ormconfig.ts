import {ConnectionOptions} from "typeorm";
import {join} from "path";

export const ormconfig: ConnectionOptions = {
   "type": "postgres",
   "host": "localhost",
   "port": 5432,
   "username": "admin",
   "password": "admin",
   "database": "loan",
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
