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
    Number(Math.round(1.005+'e2')+'e-2');
    // const views = Number(Math.round(parseInt(item['Pageviews']) / days + 'e2') +'e-2');
    const views = parseInt(item['Pageviews']);
    if (processedResults[item['Traffic Type']] >= 0) {
      processedResults[item['Traffic Type']] += views;
    } else {
      processedResults[item['Traffic Type']] = views;
    }
  });
  for (let key of Object.keys(processedResults)) {
    processedResults[key] = Math.round((processedResults[key] / days) * 100) / 100;
  }
  setTimeout(() => {totalResults[fileId] = processedResults}, 10000);
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