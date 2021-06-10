// server.js
// where your node app starts

const express = require("express");
const app = express();
const os = require("os");

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});
app.get("/dreams", (req, res) => {
  res.json(["sonho1", "sonho2", "sonho3"]);
});

const Feed = require("rss-to-json");
const regex = new RegExp(`(?<![. ]) *${os.EOL}`, "ig");

app.get("/newsg1to", (request, response) => {
  const regex2 = new RegExp(
    /Veja mais notícias da região no G1 Tocantins./,
    "ig"
  );
  
  Feed.load("https://g1.globo.com/rss/g1/to/tocantins/", function(err, rss) {
    var { items } = rss;
    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    response.json(
      items.map(it => ({
        uid: it.id,
        updateDate: new Date(it.published),
        titleText: it.title,
        mainText:
          it.title +
          `.${os.EOL}` +
          it.description.replace(regex, `.${os.EOL}`).replace(regex2, ""),
        redirectionUrl: it.link
      }))
    );
  });
});

app.get("/newstjto", (request, response) => {
  Feed.load(
    "http://www.tjto.jus.br/index.php/noticias?format=feed&type=rss",
    function(err, rss) {
      var { items } = rss;
      response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
      response.json(
        items.map(it => ({
          uid: it.id,
          updateDate: new Date(it.published),
          titleText: it.title,
          mainText:
            it.title +
            `.${os.EOL}` +
            it.description.replace(regex, `.${os.EOL}`),
          redirectionUrl: it.link
        }))
      );
    }
  );
});

// listen for requests :)
const port = process.env.PORT || 3000;
const listener = app.listen(port, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
