const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const postRouter = require("./router/posts");

const app = express();

mongoose.connect("mongodb+srv://harsh:EoJiKTYGbRWHkqRo@cluster0-pnyfq.mongodb.net/MEANDB?retryWrites=true&w=majority",{ useNewUrlParser: true })
.then(() => {
  console.log("Connected to the database :)")
})
.catch(() => {
  console.log("Connection failed! :(")
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use((req, res, next) => {
  res.setHeader(
                  "Access-Control-Allow-Origin","*"
               );
  res.setHeader(
                  "Access-Control-Allow-Headers",
                  "Origin, X-Requested-With, Content-Type, Accept"
                );
  res.setHeader(
                  "Access-Control-Allow-Methods",
                  "GET,POST,PATCH,DELETE,PUT,OPTIONS"
                );
  next();
});

app.use("/posts",postRouter);

module.exports = app;
