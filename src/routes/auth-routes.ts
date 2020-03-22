import express, { Router } from "express";
import { MongoClient } from "mongodb";
import Debug from "debug";
import passport from "passport";

import { INav } from "../types/nav";
import { databaseURL, databaseName } from "../config/db";

const debug = Debug("app:authroutes");
const router = express.Router();

const authOpts: passport.AuthenticateOptions = {
  successRedirect: "/auth/profile",
  failureRedirect: "/"
};

export function authRouter(nav: INav[]): Router {
  router.route("/signup").post((request, response) => {
    const username: string = request.body.username;
    const password: string = request.body.password;
    (async function addUser() {
      let client;
      try {
        client = await MongoClient.connect(databaseURL);
        debug("Connected to the database server");

        const user = { username, password };
        const db = client.db(databaseName);
        const collection = db.collection("users");

        const results = await collection.insertOne(user);
        debug(results);

        request.login(results.ops[0], () => {
          response.redirect("/auth/profile");
        });
      } catch (err) {
        debug(err.stack);
      } finally {
        if (client) {
          client.close();
        }
      }
    })();
  });

  router
    .route("/signin")
    .get((req, res) => res.render("signin", { nav, title: "sigin" }))
    .post(passport.authenticate("local", authOpts));

  router
    .route("/profile")
    .all((req, res, next) => (req.user ? next() : res.redirect("/")))
    .get((req, res) => res.json(req.user));

  return router;
}
