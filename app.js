var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var User = require("./models/User");
var jwt = require("./services/jwt");

mongoose.connect("mongodb://test:test@ds137246.mlab.com:37246/mydb")
var app = express();

app.use(bodyParser.json());

app.get("/hello", function (req, res) {
    res.send("this is working");
});


app.use(function (req, res, next) {
    // if(req.method=="OPTIONS"){
    //     next();
    // }
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,DELETE,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
})

app.post("/register", function (req, res) {


    var user = req.body;
    var newUser = new User.model({
        name: user.name,
        userName: user.userName,
        email: user.email,
        password: user.password,
    });

    var payload = {
        issuer: req.hostname,
        sub: user._id
    }

    var jwtoken = jwt.encode(payload, "mysecret");
    newUser.save(function (err) {

        res.status(200).send({
            token: jwtoken,
            user: newUser.toJSON()

        });
    })


});



var server = app.listen(3300, function () {
    console.log("app is running on ", server.address().port);
});


