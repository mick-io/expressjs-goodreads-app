import express, { Router } from "express";
import { MongoClient } from "mongodb";
import { databaseURL, databaseName } from "../config/db";
import Debug from "debug";
import { format } from "url";

const router = express.Router();
const debug = Debug("app:adminroutes");

const books = [
  {
    title: "War and Peace",
    genre: "Historical Fiction",
    author: "Lev Nikolayevich Tolstory",
    goodreadsID: "656",
    read: false
  },
  {
    title: "Les Miserables",
    genre: "Historical Fiction",
    author: "Victor Hugo",
    id: "24280",
    read: false
  },
  {
    title: "The Time Machine",
    genre: "Science Fiction",
    author: "H. G. Wells",
    goodreadsID: "2493",
    read: false
  },
  {
    title: "A Journey into the Center of the Earth",
    genre: "Science Fiction",
    author: "Jules Verne",
    goodreadsID: "51431853",
    read: false
  },
  {
    title: "The Dark World",
    genre: "Fantasy",
    author: "Henry Kuttner",
    goodreadsID: "1881716",
    read: false
  },
  {
    title: "The Wind in the Willows",
    genre: "Fantasy",
    author: "Kenneth Grahame",
    goodreadsID: "62278",
    read: false
  }
];

export function adminRouter(): Router {
  router.route("/").get((req, res) => {
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(databaseURL);
        debug("Connected to the database server");

        const db = client.db(databaseName);
        const insertResponse = await db.collection("books").insertMany(books);

        res.json(insertResponse);
      } catch (err) {
        debug(err.stack);
      } finally {
        if (client) {
          client.close();
        }
      }
    })();
  });

  return router;
}
