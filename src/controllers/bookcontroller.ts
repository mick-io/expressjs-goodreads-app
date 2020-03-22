import Debug, { Debugger } from "debug";
import { Request, Response, NextFunction } from "express";
import { MongoClient, ObjectID, Db, Collection } from "mongodb";

import { INav } from "../types/nav";
import { databaseURL, databaseName } from "../config/db";
import { IBookService } from "../services/books-service";

const debug: Debugger = Debug("app:bookController");

interface IBook {
  _id: ObjectID;
  details: any;
  goodreadsID: string;
  authbor: string;
  genre: string;
  read: boolean;
  title: string;
}

export function bookController(bookService: IBookService, nav: INav[]) {
  async function getIndex(req: Request, res: Response) {
    let client: MongoClient | null = null;
    try {
      client = await MongoClient.connect(databaseURL);
      debug("Conncted to the database server");

      const db = client.db(databaseName);
      const collection = await db.collection("books");
      const books = await collection.find().toArray();

      const options = { title: "Library", nav, books };
      res.render("booklistview", options);
    } catch (err) {
      debug(err.stack);
    } finally {
      if (client) {
        client.close();
      }
    }
  }

  async function getByID(req: Request, res: Response) {
    let client: MongoClient | null = null;
    try {
      client = await MongoClient.connect(databaseURL);
      debug("Conncted to database server");

      const db: Db = client.db(databaseName);
      const collection: Collection<IBook> = await db.collection("books");
      const book: IBook | null = await collection.findOne({ _id: new ObjectID(req.params.id) });
      debug(book);

      const options = { title: "Library", nav, book };

      if (book !== null) {
        // book.details = await bookService.getByID(book._id.toHexString());
        book.details = await bookService.getByID(book.goodreadsID);
        res.render("bookview", options);
      } else {
        // TODO
      }
    } catch (err) {
      debug(err.stack);
    } finally {
      if (client) {
        client.close();
      }
    }
  }

  async function middleware(req: Request, res: Response, next: NextFunction) {
    // if (req.user) {
      next();
    // } else {
    //   res.redirect("/");
    // }
  }

  return {
    getIndex,
    getByID,
    middleware,
  };
}
