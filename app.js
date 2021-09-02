const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const request = require("request");
const https = require("https");
const Swal = require("sweetalert2");

const homeStartingContent = "Hi, This is Ishika Bansal.";
const aboutContent = "Hi, This is Ishika Bansal, a Front End Web developer and now a fullstack probably! This is my first blog website which I have made under the course of App Brewery. all thanks to Angela Yu!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
  res.render("home", {
    homeStartingContent: homeStartingContent,
    posts: posts
  });
});

app.get("/about", function(req, res){
  res.render("about", {
    aboutContent: aboutContent
  });
});


app.get("/contact", function(req, res){
  res.render("contact");
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/posts/:topic", function(req, res){
  const requiredTitle = _.lowerCase(req.params.topic);

  posts.forEach(function(element){
    if(_.lowerCase(element.title) === requiredTitle){
      res.render("post", {
        title: element.title,
        content: element.content
      });
      console.log("Match Found!");
    }
    else{
      console.log("Not A Match!");
    }
  });
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.composeVal,
    content: req.body.postTitle
  };
  posts.push(post);
  res.sendFile(__dirname + "/views/loader.html");
});

app.post("/contact", function(req, res){
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us5.api.mailchimp.com/3.0/lists/051a7486df";
    const options = {
        method: "POST",
        auth: "Ishika:<API-KEY>"
    };

    const request = https.request(url, options, function(response){
      if(response.statusCode === 200){
        console.log(__dirname + "/views/success.html");
      }
      else{
        res.sendFile(__dirname + "/views/failure.html");
      }
      
      response.on("data", function(data){
          console.log(JSON.parse(data));
      });
    });

    request.write(jsonData);
    request.end();
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
