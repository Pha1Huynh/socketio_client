let getHomePage = async (req, res) => {
  return res.render("homePage.ejs");
};
module.exports = {
  getHomePage,
};
