module.exports = async function getImage(divSelector, page) {
  const images = [];
  try {
    let div_selector = divSelector;

    let list_length = await page.evaluate((sel) => {
      let elements = Array.from(document.querySelectorAll(sel));
      return elements.length;
    }, div_selector);

    console.log(list_length);

    for (let i = 0; i < list_length; i++) {
      var href = await page.evaluate(
        (l, sel) => {
          let elements = Array.from(document.querySelectorAll("img" + sel));
          return elements[l] ? elements[l].src : "";
        },
        i,
        div_selector
      );
      images.push(href);
    }
  } catch (error) {
    return console.log(error.message);
  }

  return images;
};
