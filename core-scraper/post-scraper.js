const scrollToBottom = require("../middlewares/auto-scroll");
const PostsOfUsers = require("../model/posts-model");
const getLink = require("./link-scraper");
const getImage = require("./img-scraper");
const getText = require("./text-scraper");
const getFriends = require("./friends-scraper");
const fs = require("fs");
const log = require("log-to-file");

var date = new Date().toLocaleString();

// const target = fs.readFileSync("/home/osint/Desktop/osint/Facebook/faceboook-scraper-backend/target.txt", "utf-8").split("\n");
const target = fs.readFileSync("./target.txt", "utf-8").split("\n");

module.exports = async function createGroups(page) {
  const result = [];

  for (let j = 0; j < target.length; j++) {
    // NAVIGATION AND SCROLING TO THE DESIRED PAGE //
    try {
      var friends = await getFriends(page, target[j]);
      await page.waitFor(1000);
      await page.goto("https://facebook.com/" + target[j]);
      await page.waitFor(5000);
      console.log("navigation succesfull");
      await scrollToBottom(page, 10000);
      await page.waitFor(1000);
    } catch (error) {
      return console.log(error.message);
    }

    // Selectors for All thing relate to posts

    const postLink_selector =
      ".x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.xt0b8zv.xo1l8bm";
    const postContent_selector =
      ".xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs.x126k92a";
    const postImage_selector =
      ".x1ey2m1c.xds687c.x5yr21d.x10l6tqk.x17qophe.x13vifvy.xh8yej3.xl1xv1r";
    const postLikes_selector = ".xrbpyxo.x6ikm8r.x10wlt62.xlyipyv.x1exxlbk";
    const timeOfPost_selector =
      ".x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.xt0b8zv.xo1l8bm";

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

    for (let i = 0; i < allPosts.length; i++) {
      const post = {
        dateOfTheScrape: date,
        nameOfPoster: target[j],
        postLink: postLinks[i],
        postContent: allPosts[i],
        numberOfLikes: postLikes[i],
        postImage: postImages[i],
        timeOfPost: timeOfPost[i],
        numberOfComments: "",
        numberOfShares: "",
        postSentiment: "",
        AboutPoster: [],
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
