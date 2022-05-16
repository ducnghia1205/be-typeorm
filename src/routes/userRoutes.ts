import { body, param } from "express-validator";
import {UserController} from "../controller/UserController";

export const UserRoutes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "getAll",
    validation: [],
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "getDetail",
    validation: [
        param('id').isInt(),
    ],
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save",
    validation: [
        body('firstName').isString(),
        body('lastName').isString(),
    ],
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove",
    validation: [
        param('id').isInt(),
    ],
}];
