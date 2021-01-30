const express = require("express");
var cors = require("cors");
require("dotenv").config();
const logger = require("morgan");
const pe = require("parse-error");
const routes = require("./routes");

const app = express();

const port = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    let responseBody = {
      message: "Invalid JSON payload passed.",
      status: "error",
      data: null,
    };
    return res.status(400).json(responseBody);
  }

  next();
});
//use routes
app.use("/", routes);

process.on("unhandledRejection", (error) => {
  console.error("Uncaught Error", pe(error));
  return res
    .status(400)
    .json({ message: "Server Error!", status: "error", data: null });
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
