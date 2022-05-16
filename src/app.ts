import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import * as morgan from 'morgan';
import { validationResult } from "express-validator";
import {Routes} from "./routes";
import * as cors from 'cors';
import {closeLoan} from "./cron/cronLoan";
import * as schedule from 'node-schedule';

function handleError(err, _req, res, _next) {
  res.status(err.statusCode || 500).send(err.message)
}

const app = express();
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cors());

schedule.scheduleJob('*/1 * * * *', async () => closeLoan())


Routes.forEach(route => {
  (app as any)[route.method](route.route,
    ...route.validation,
    async (req: Request, res: Response, next: Function) => {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await (new (route.controller as any))[route.action](req, res, next);
      return result;
    } catch(err) {
      next(err);
    }
  });
});

app.use(handleError);

export default app;
