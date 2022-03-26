//initializes
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");

//app
const app = express();

//port
const port = 6400;
const mongoCreds = process.env.MONGO_MOCK_DB_CREDS; // process.env.MONGO_MOCK_DB_CREDS

//routes
const productRoute = require("./routes/product");
const homeRoute = require("./routes/home");
const cartRoute = require("./routes/cart");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

//middleware
app.use(cors());

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//view engine
app.set("view engine", "ejs");
app.set("views", "views");

app.disable("view cache");

app.use("/", homeRoute);
app.use("/products", productRoute);
app.use("/carts", cartRoute);
app.use("/users", userRoute);
app.use("/auth", authRoute);

//mongoose
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(mongoCreds, { useNewUrlParser: true })
  .then(() => {
    app.listen(process.env.PORT || port, () => {
      console.log(`eCommerce API listening at ${process.env.PORT || port}...`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
