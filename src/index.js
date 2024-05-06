const express = require("express")
const morgan = require("morgan")



// initialitazion
const app = express();

// Settings
app.set("port", process.env.PORT || 5000);
app.set("view engine", "ejs");

//Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Globla Variables
app.use((req, res, next) => {
    next();
  });

 /*  //Routes
app.use(require("./routes")); */

//start the server
app.listen(app.get("port"), () => {
    console.log("Server on port", app.get("port"));
  });