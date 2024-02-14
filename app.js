//importing modules & library
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

//using express in our app and using bodyParser to parse data received from client
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

//to use local files when client requests for it or for accessing all local files we need to use static function of express
app.use(express.static("public"));

//handling get request on routes from clients (like excessing specific route)
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

//handling post requests from client (like posting form data)
app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  //creating object(single object or member) and associating it with mailchimp properties
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };

  //handling post from failure page from Failure
  app.post("/failure", function(req,res){
    res.redirect("/");
  })

  //converting js object into json format string to post on mailchimp server
  const jsonData = JSON.stringify(data);
  const url = "https://us9.api.mailchimp.com/3.0/lists/7e9cdc9804"
  const options = {
    method: 'POST',
    auth: "yash08:ab1347dcc2f3d98d19bb7a4ea50dad4d-us9"
  }


  const request = https.request(url, options, function(response) {
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  //to send the data we received from client to the mailchimp server
  request.write(jsonData);
  request.end();

});

//listening to a specific port
app.listen(3000, function() {
  console.log("Server is running on port 3000");
})



// API Key
// ab1347dcc2f3d98d19bb7a4ea50dad4d-us9

// List ID
// 7e9cdc9804
