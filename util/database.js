const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

let _db;

const mongoConnect = (cb) => {

  MongoClient.connect(
    "mongodb+srv://sofiia:vgs0KiA7swRD4Ju1@cluster0.5xlmjrz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db()
      cb();
    })
    .catch((err) => {
    console.log(err)
    throw err
  });
}

const getDb = () => {
  if(_db){
    return _db;
  }
throw "No database found!"
}


exports.mongoConnect = mongoConnect
exports.getDb = getDb