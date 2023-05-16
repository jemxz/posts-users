const puppeteer = require("puppeteer");
const fs = require("fs");
const log = require("log-to-file");

const scrollToBottom = require("../middlewares/auto-scroll");
const PostsOfUsers = require("../model/posts-model");
const getLink = require("./link-scraper");
const getImage = require("./img-scraper");
const getText = require("./text-scraper");
const getFriends = require("./friends-scraper");
const getAbout = require("./about-scraper");
const getNumberOfComments = require("./numberOfComments-scraper");
const getNumberOfShares = require("./numberOfShares-scraper");

var date = new Date().toLocaleString();

// const target = fs.readFileSync("/home/osint/Desktop/osint/Facebook/faceboook-scraper-backend/target.txt", "utf-8").split("\n");
const target = fs.readFileSync("./target.txt", "utf-8").split("\n");

module.exports = async function createGroups(page) {
  const result = [];

  for (let j = 0; j < target.length; j++) {
    // NAVIGATION AND SCROLING TO THE DESIRED PAGE //
    try {
      var friends = await getFriends(page, target[j]);
      const mobileDevice = puppeteer.devices["iPhone X"];
      await page.emulate(mobileDevice);
      var info = await getAbout(page, target[j]);
      await page.waitFor(1000);
      await page.goto("https://m.facebook.com/" + target[j]);
      await page.waitFor(5000);
      console.log("navigation succesfull");
      await scrollToBottom(page, 10000);
      await page.waitFor(1000);
    } catch (error) {
      return console.log(error.message);
    }

    // Selectors for All thing relate to posts

    const postLink_selector = "._5msj";
    const postContent_selector = "._5rgt._5nk5._5msi";
    const postImage_selector = ".img._lt3._4s0y";
    const postLikes_selector = "._1g06";
    const timeOfPost_selector = "._52jc._5qc4._78cz._24u0._36xo";
    const numberOfCommentsAndShares_selector = "._1j-c";

    ///////////////////////////////////// Scraping all things releated to posts  ////////////////////////////////////////////////////////////////////////////////
    const postLinks = await getLink(postLink_selector, page);
    // Scraping for all post Content //
    const allPosts = await getText(postContent_selector, page);
    // Scraping for all post Images
    const postImages = await getImage(postImage_selector, page);
    // Scraping for all post Likes
    const postLikes = await getText(postLikes_selector, page);
    // Scraping for all allPosts Time of Post
    const timeOfPost = await getText(timeOfPost_selector, page);
    // Scraping for Number of Comments
    const numberOfComments = await getNumberOfComments(
      numberOfCommentsAndShares_selector,
      page
    );
    // Scraping for Number of Shares
    const numberOfShares = await getNumberOfShares(
      numberOfCommentsAndShares_selector,
      page
    );

    for (let i = 0; i < allPosts.length; i++) {
      const post = {
        dateOfTheScrape: date,
        nameOfPoster: target[j],
        postLink: postLinks[i],
        postContent: allPosts[i],
        numberOfLikes: postLikes[i],
        postImage: postImages[i],
        timeOfPost: timeOfPost[i],
        numberOfComments: numberOfComments[i],
        numberOfShares: numberOfShares[i],
        postSentiment: "",
        aboutPoster: info,
        friendsOfPoster: friends,
        comments: [
          {
            commentContent: "",
            commenterName: "",
            commentorId: "",
            commentSentiment: "",
          },
        ],
      };
      const posts = new PostsOfUsers(post);
      await posts.save();
      result.push(post);
    }
  }
  return result;
};
