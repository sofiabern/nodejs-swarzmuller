const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error.js");
const mongoConnect = require('./util/database.js').mongoConnect
const User = require('./models/user.js')

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
 User.findById("682f7cf8bcb4a5f9b8bdc48b")
   .then((user) => {
     req.user = user;
     next();
   })
   .catch((err) => console.log(err)); 
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000)
})