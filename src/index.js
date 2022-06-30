const express = require("express");
const route = require("./routes/route");

const bodyParser = require('body-parser')
const {default:mongoose}=require('mongoose')

const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://vishal221:QbG4QZXzT3SrfBAF@cluster0.jegkx.mongodb.net/Project2-db", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )



app.use('/',route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});