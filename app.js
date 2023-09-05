//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "MyDailyJournal is a beginner-friendly online platform designed to help you establish the habit of daily journaling. Whether you're new to journaling or a seasoned writer, our user-friendly interface makes it easy for anyone to record their thoughts, ideas, and experiences on a daily basis. Any new post that you compose will be shown down here.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://<YourUsername>:<YourPassword>@cluster0.yb3jo2c.mongodb.net/<YourCollectionName>');

const postSchema = mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find({}).then((foundBlog) => {
    res.render("home", {
      content : homeStartingContent, 
      posts    : foundBlog
    });
  });
});

app.get("/about", (req,res) => {
  res.render("about", {content:aboutContent});
});

app.get("/contact", (req, res) => {
  res.render("contact", {content:contactContent});
});

app.get("/compose", (req,res) => {
  res.render("compose");
});

app.get("/posts/:postID", (req,res) => {
  const requestedPostId  = req.params.postID;

  Post.findOne({_id:requestedPostId}).then((result) => {
    res.render("post", {
      title : result.title,
      content  : result.content
    });
  });
});

app.post("/compose", (req,res) => {
  const post = new Post({
    title: req.body.composeTitle,
    content: req.body.composeBody
  })
  post.save();

  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
