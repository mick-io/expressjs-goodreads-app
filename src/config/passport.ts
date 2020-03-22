import passport from "passport";
import { Express } from "express";

import { localStrategy } from "./strategies/local.strategy";

localStrategy();

export function passportConfig(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());

  // Stores user in session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Retrieves user from session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}
