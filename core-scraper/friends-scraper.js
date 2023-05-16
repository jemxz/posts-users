const getLink = require("./link-scraper");
const getImage = require("./img-scraper");
const getText = require("./text-scraper");
const scrollToBottom = require("../middlewares/auto-scroll");

const friendsName_selector =
  ".x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x676frb.x1lkfr7t.x1lbecb7.x1s688f.xzsf02u";
const friendsLink_selector =
  ".x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.xt0b8zv";
const friendsImage_selector =
  ".x1lq5wgf.xgqcy7u.x30kzoy.x9jhf4c.x9f619.xl1xv1r";

module.exports = async function getFriends(page, target) {
  const friends = [];

  try {
    await page.goto("https://facebook.com/" + target + "/friends");
    await scrollToBottom(page, 15000);
    const friendsName = await getText(friendsName_selector, page);
    const friendsLink = await getLink(friendsLink_selector, page);
    const friendsImage = await getImage(friendsImage_selector, page);

    for (let i = 0; i < friendsName.length; i++) {
      const friend = {
        friendName: friendsName[i],
        firendImage: friendsImage[i],
        friendLink: friendsLink[i + 1],
      };
      friends.push(friend);
    }
    console.log(friends);
    return friends;
  } catch (error) {
    return [];
  }
};
