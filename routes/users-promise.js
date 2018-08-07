const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const apiUrl = "https://api.github.com/users";

function getUser(username) {
  return fetch(`${apiUrl}/${username}`, {
    access_token: "5a5ff3c1c716aa274b7150747a57ed129ce76e52"
  }).then(res => {
    return res.json().then(user => {
      return { user, found: res.status === 200 };
    });
  });
  // .catch(error => error);
}

/* GET users listing. */
router.get("/users/:username", function(req, res, next) {
  // const apiUrl = "https://api.github.com/";
  console.log(req.params.username);
  const { username } = req.params;

  getUser(username)
    .then(apiResult => {
      if (!apiResult.found) {
        apiResult.status(404).end(apiResult.message);
        return;
      }

      const { user } = apiResult;
      console.log(apiResult);
      return user;
    })
    .catch(error => console.log(error));
});

module.exports = router;
