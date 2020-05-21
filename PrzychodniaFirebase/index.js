const express = require('express');
const methodOverride = require('method-override');
const firebase = require("firebase");
const routes = require('./routes');
const firebaseConfig = require("./firebaseConfig");

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method
    delete req.body._method
    return method
  }
}));
app.set('view engine', 'ejs');

firebase.initializeApp(firebaseConfig);

routes(app);

const server = app.listen(3001, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log("App listening at http://%s:%s", host, port)
});