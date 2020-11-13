const express = require('express');
const app = express();

const PORT = process.env.PORT || 8003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const totalResults = {};

app.post('/ratio-users-sessions', (req, res) => {
  const fileId = req.body.fileId;
  const filteredData = req.body.filteredData;
  let processedResults = {};
  let users = 0;
  let sessions = 0;
  filteredData.forEach((item) => {
    users += item['Users'];
    sessions += item['Sessions'];
  });
  setTimeout(() => {totalResults[fileId] = (sessions / users).toFixed(2)}, 10000);
  console.log(totalResults);  
});

app.get('/ratio-users-sessions/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  console.log(fileId);
  const requestedResult = totalResults[fileId];
  console.log(requestedResult);
  if (requestedResult) {
    res.json({processingFinished: true, requestedResult});
  } else {
    res.json({processingFinished: false})
  }
});

app.listen(PORT, () => {
  console.log(`Ratio Users & Sessions listening on port ${PORT}...`);
});