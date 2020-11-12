const express = require('express');
const app = express();

const PORT = process.env.PORT || 8002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const totalResults = {};

app.post('/average-pageviews', (req, res) => {
  const fileId = req.body.fileId;
  const filteredData = req.body.filteredData;
  const days = 31;
  let processedResults = {};
  filteredData.forEach((item) => {
    const views = (parseInt(item['Pageviews']) / days).toFixed(2);
    if (processedResults[item['Traffic Type']] >= 0) {
      processedResults[item['Traffic Type']] += views;
    } else {
      processedResults[item['Traffic Type']] = views;
    }
  });
  setTimeout(() => {totalResults[fileId] = processedResults}, 4000);
  console.log(totalResults);
});

app.get('/average-pageviews/:fileId', (req, res) => {
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
  console.log(`Average Pageview listening on port ${PORT}...`);
});