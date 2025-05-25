const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")

const errorController = require("./controllers/error.js");
// const User = require('./models/user.js')

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//  User.findById("682f7cf8bcb4a5f9b8bdc48b")
//    .then((user) => {
    
//     if (!user.cart) {
//       user.cart = { items: [] };
//     }

//      req.user = new User(user.name, user.email, user.cart, user._id);
//      next();
//    })
//    .catch((err) => console.log(err)); 
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(
  "mongodb+srv://sofiia:vgs0KiA7swRD4Ju1@cluster0.5xlmjrz.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
)
.then(result => {
  app.listen(3000);
})
.catch(err => {
  console.log(err)
})