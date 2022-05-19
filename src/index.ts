import "reflect-metadata";
import { createConnection } from "typeorm";
import app from './app';
import port, {ormconfig} from "../ormconfig";

createConnection(ormconfig).then(async connection => {
  app.listen(port);
  console.log(`Express server has started on port ${port}.`);
}).catch(error => console.log(error));
