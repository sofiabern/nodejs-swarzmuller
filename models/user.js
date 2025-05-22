const mongodb = require("mongodb");
const getDb = require("../util/database.js").getDb;

class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;

  }

  save() {
    const db = getDb();

    return db
      .collection("users")
      .insertOne(this)
      .then((user) => console.log(user))
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(userId) {
    const db = getDb();

    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((user) => user)
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
