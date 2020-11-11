const express = require('express');
const app = express();

const PORT = process.env.PORT || 8004;

const axios = require('axios');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const totalResults = {};

app.post('/maximum-sessions', (req, res) => {
  const fileId = req.body.fileId;
  const filteredData = req.body.filteredData;
  console.log(req.body);
  let processedResults = {};
  // let users = 0;
  // let sessions = 0;
  // console.log(req.body);
  // filteredData.forEach((item) => {
  //   users += item['Users'];
  //   sessions += item['Sessions'];
  // });
  // totalResults[fileId] = (sessions / users).toFixed(2);
  // console.log(totalResults);  
});

app.listen(PORT, () => {
  console.log(`Weekly Maximum Sessions listening on port ${PORT}...`);
});