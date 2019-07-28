const express = require("express");
const Post = require("./models/post");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

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

app.post("/posts",(req,res,next) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content
    });
    post.save().then(result => {
      res.status(201).json({
         postId: result._id
      });
    });

});

app.get("/posts",(req, res, next) => {
  Post.find().then(document =>
    {
      res.status(200).json
      ({
        message:"I am successfuly executed!",
        posts : document
      });
   });

});

app.delete("/posts/:id",(req,res,next) => {
  Post.deleteOne({_id:req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message:'Post Deleted!'});
  });
});

module.exports = app;
