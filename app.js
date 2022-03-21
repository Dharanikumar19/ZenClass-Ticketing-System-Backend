require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");


//cors
app.use(cors());

//logger
app.use(morgan('tiny'));

//connect to db
const URI = process.env.MONGODB_URI
mongoose.connect(URI, {
    useNewUrlParser : true,
    useUnifiedTopology : true
}, err => {
    if(err) throw err;
    console.log("database connected successfully")
})
  

//body parser
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json());
app.use(cookieParser());

//import Routers
const userRouter = require("./routers/userRouter")
const ticketRouter = require("./routers/ticketRouter")

//use Routers
app.use("/user", userRouter)
app.use("/ticket", ticketRouter)




app.use("/", (req, res) => {
    res.json({msg : "Server is up and running"})
})


const port = process.env.PORT || 4000;
app.listen(port, () =>{console.log(`Server is running on port ${port}`)})