var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

async function getByUsername(username) {
  const result = await fetch(`https://api.github.com/users/${username}`);

  return { user: await result.json(), found: result.status === 200 };
}

async function getProperty(url) {
  return (await fetch(url)).json();
}

/* GET users listing. */
router.get("/users/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    const apiResult = await getByUsername(username);

    if (!apiResult.found) {
      res.status(404).end();
      return;
    }

    const { user } = apiResult;
    const { repos_url, followers_url } = user;

    const [repos, followers] = await Promise.all([
      getProperty(repos_url),
      getProperty(followers_url)
    ]);

    user.repos = repos;
    user.followers = followers;

    res.send(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(error.message)
      .end();
  }

  // res.send(apiResult);
});

module.exports = router;
