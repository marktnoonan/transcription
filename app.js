const express = require('express');
const path = require('path');
const app = express();

app.listen(3000, () => console.log('Server started'));

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