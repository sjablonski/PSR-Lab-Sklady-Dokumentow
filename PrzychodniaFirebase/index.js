const express = require('express');
const methodOverride = require('method-override');
const routes = require('./routes');
const firebase = require("firebase");

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

const firebaseConfig = {
  apiKey: "AIzaSyCtfnCTas30sOyAi8VH76n9PGooF6Nl37U",
  authDomain: "przychodnia-3390a.firebaseapp.com",
  databaseURL: "https://przychodnia-3390a.firebaseio.com",
  projectId: "przychodnia-3390a",
  storageBucket: "przychodnia-3390a.appspot.com",
  messagingSenderId: "737246018854",
  appId: "1:737246018854:web:fe3bb8b2617fc3dfaf55e7"
};

firebase.initializeApp(firebaseConfig);

routes(app);

const server = app.listen(3001, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log("App listening at http://%s:%s", host, port)
});