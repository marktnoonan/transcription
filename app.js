const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/observe', function (req, res) {
  res.sendFile(__dirname + '/observe.html');
});

app.get('/playback', function (req, res) {
  res.sendFile(__dirname + '/playback.html');
});

app.get('/sayword', function (req, res) {
  res.sendFile(__dirname + '/sayword.html');
});
