require("dotenv").config();
const createError = require("http-errors");
const { session, loadSessionUser } = require("./config/session.config");
require("./config/hbs.config");

const express = require("express");
const app = express();

require("./config/db.config.js");

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

app.use(express.static("public"));

app.use(session);
app.use(loadSessionUser);

const router = require("./config/routes.config");
app.use(router);

app.use((error, req, res, next) => {
   error = !error.status ? createError(500, error) : error;
   console.error(error);
   res.status(error.status).render(`errors/${error.status}`, { error });
 });

const port = 3000;

app.listen(port, () => console.info(`app listening at port ${port}`));
