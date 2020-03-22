import path from "path";

import express from "express";
import chalk from "chalk";
import Debug from "debug";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import sesion from "express-session";

import { bookRouter } from "./routes/book-routes";
import { adminRouter } from "./routes/admin-routes";
import { authRouter } from "./routes/auth-routes";
import { INav } from "./types/nav";
import { passportConfig } from "./config/passport";

// TODO: Check for and load config/dbsecrets.yaml

const port = process.env.PORT || 3000;
const debug = Debug("app");
const app = express();
const nav: INav[] = [
  {
    link: "/books",
    title: "Books"
  },
  {
    link: "/authors",
    title: "Authors"
  }
];

// app.use((req, res, next) => {
// debug("My Middleware");
// next();
// });

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sesion({ secret: "library123" }));

passportConfig(app);

app.use(express.static(path.join(__dirname, "../public")));
app.use("/css", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use("/js", express.static(path.join(__dirname, "../node_modules/jquery/dist")));

app.use("/books", bookRouter(nav));
app.use("/admin", adminRouter());
app.use("/auth", authRouter(nav));

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.get("/", (_, response) => {
  const options = { title: "Library", nav };
  response.render("index", options);
});

app.listen(port, () => {
  debug(`Listening on port ${chalk.green(port)}`);
});
