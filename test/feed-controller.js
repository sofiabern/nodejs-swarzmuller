const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user.js");

const FeedController = require("../controllers/feed.js");

describe("Feed Controller", function () {
  before(function (done) {
    const MONGODB_URI =
      "mongodb+srv://sofiia:vgs0KiA7swRD4Ju1@cluster0.5xlmjrz.mongodb.net/test-messages?retryWrites=true&w=majority&appName=Cluster0";

    mongoose
      .connect(MONGODB_URI)
      .then(() => {
        const user = new User({
          email: "test@test.com",
          password: "tester",
          name: "Test",
          posts: [],
          _id: "68671bad47c065f2d57c7ca2",
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  it("should add a created post to the posts of the creator", function (done) {
   
    const req = {
      body: {
        title: "Test Post",
        content: "A Test Post",
      },
      file: {
        path: "abc",
      },
      userId: "68671bad47c065f2d57c7ca2",
    };

    const res = {
        status: function(){
            return this
        },
        json: function(){}
    }

    FeedController.createPost(req, res, () => {}).then((savedUser) => {
     expect(savedUser).to.have.property('posts')
     expect(savedUser.posts).to.have.length(1)
     done()
    });

  });

  
  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
