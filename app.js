const path = require('path')
const fs = require('fs')
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require('multer')
const { v4: uuidv4 } = require("uuid");
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require('./graphql/schema.js')
const graphqlResolver = require('./graphql/resolvers.js')
const auth = require('./middleware/auth.js')

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  }else {
    cb(null, false)
  }
}

app.use(bodyParser.json());
app.use( multer({storage: fileStorage, fileFilter: fileFilter}).single('imageUrl'))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if(req.method === 'OPTIONS'){
    return res.sendStatus(200)
  }
  next();
});

app.use(auth);

app.put('/post-image', (req, res, next) => {
  if(!req.isAuth){
    throw new Error("Not authenticated!")
  }
  if(!req.file){
    return res.status(200).json({message: "No file provided!"})
  }
  if(req.body.oldPath){
    clearImage(req.body.oldPath)
  }
  return res.status(201).json({message: "File stored", filePath: req.file.path})
})


app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err){
      if(!err.originalError) {
        return err;
      }
      const data = err.originalError.data
      const message = err.message || "An error occured."
      const code = err.originalError.code || 500
      return {message: message, status: code, data: data}
    }
  })
);


app.use((error, req, res, next) => {
  console.log(error)
  const statusCode = error.statusCode;
  const message = error.message;
  const data = error.data
  res.status(statusCode).json({ message: message, data: data});
})

const MONGODB_URI =
  "mongodb+srv://sofiia:vgs0KiA7swRD4Ju1@cluster0.5xlmjrz.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
  app.listen(8080);
  })
  .catch((err) => console.log(err));

  const clearImage = (filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => console.log(err));
  };
  