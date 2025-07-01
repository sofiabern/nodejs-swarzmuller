const path = require('path')
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require('multer')
const { v4: uuidv4 } = require("uuid");


const feedRoutes = require("./routes/feed.js");
const authRoutes = require('./routes/auth.js')

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
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

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
   const server = app.listen(8080);
   const socket = require("./socket");
   const io = socket.init(server, {
     cors: {
       origin: "*",
       methods: ["GET", "POST"],
     },
   });
     io.on('connection', socket => {
    console.log('Client connected')
   })
  })
  .catch((err) => console.log(err));
