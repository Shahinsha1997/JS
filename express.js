var express=require('express');
var app=express();
app.use("/clinic",express.static(__dirname+"/clinic"));
app.listen(8443);