import passport from "passport";
import { Strategy } from "passport-local";
import Debug from "debug";
import { MongoClient } from "mongodb";

import { databaseURL, databaseName } from "../db";

const debug = Debug("app:local.strategy");

export function localStrategy() {
  const fields = {
    usernameField: "username",
    passwordField: "password"
  };
  const strategy = new Strategy(fields, (username, password, done) => {
    (async function mogno() {
      let client;
      try {
        client = await MongoClient.connect(databaseURL);
        debug("Connected to the database server");

        const db = client.db(databaseName);
        const collection = db.collection("users");
        const user = await collection.findOne({ username });

        user.password === password ? done(null, user) : done(null, false);
      } catch (err) {
        debug(err.stack);
      } finally {
        if (client) {
          client.close();
        }
      }
    })();
  });
  passport.use(strategy);
}
