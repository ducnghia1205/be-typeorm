import "reflect-metadata";
import { createConnection } from "typeorm";
import { port } from './config';
import app from './app';
import {ormconfig} from "../ormconfig";

createConnection(ormconfig).then(async connection => {
  app.listen(port);
  console.log(`Express server has started on port ${port}.`);
}).catch(error => console.log(error));
