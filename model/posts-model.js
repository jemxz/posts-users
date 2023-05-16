const mongoose = require("mongoose");
const { Schema } = mongoose;

const postsOfUsers = new Schema({
  dateOfTheScrape: String,
  nameOfPoster: String,
  postLink: String,
  postContent: String,
  numberOfLikes: String,
  postImage: String,
  timeOfPost: String,
  numberOfComments: String,
  numberOfShares: String,
  postSentiment: String,
  aboutPoster: Object,
  friendsOfPoster: Array,
  comments: [
    {
      commentContent: String,
      commenterName: String,
      commentorId: String,
      commentSentiment: String,
    },
  ],
});

const PostsOfUsers = mongoose.model("PostsOfUsers", postsOfUsers);

module.exports = PostsOfUsers;
