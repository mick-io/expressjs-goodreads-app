import express, { Router } from "express";
import Debug from "debug";

import { INav } from "../types/nav";
import { bookController } from "../controllers/bookcontroller";
import { booksService } from "../services/books-service";

const debug = Debug("app:bookroutes");
const router = express.Router();

export function bookRouter(nav: INav[]): Router {
  const { getIndex, getByID, middleware } = bookController(booksService, nav);

  router.use(middleware);
  router.route("/").get(getIndex);
  router.route("/:id").get(getByID);

  return router;
}
