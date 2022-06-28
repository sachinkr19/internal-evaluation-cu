const express = require("express");
const morgan = require("morgan");
const blogRoutes = require("./routes/blogRoutes");

// express app
const app = express();

// Moongoose
const mongoose = require("mongoose");
// const dburi = "mongodb://localhost:27017/exam_db";
const dburi =
  "mongodb+srv://newUserTemp:CFt3rd2I7DIDKiTQ@cluster0.bgynx.mongodb.net/?retryWrites=true&w=majority";
//
mongoose.connect(dburi, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//Get the default connection
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "Database Connection Error:"));
db.once("open", function () {
  console.log("Monogo Connection OPEN");
});

// register view engine
app.set("view engine", "ejs");

// middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// blog routes
app.use("/blogs", blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

// Start the express app binded under the http module of the node library
const http = require("http");
const httpServer = http.Server(app);
//
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, function () {
  console.log(`Server Running on Port ${PORT}`);
});
