require('dotenv').config();

export const port = process.env.PORT;

export const dbTest = {
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "admin",
    "password": "admin",
    "database": "loan_test",
    "synchronize": false,
    "logging": false,
    "entities": [
        "src/entity/**/*.ts"
    ],
    "migrations": [
        "src/migration/**/*.ts"
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
