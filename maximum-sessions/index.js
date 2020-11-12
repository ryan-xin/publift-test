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
  const filteredDates = req.body.filteredDates;
  const weekNums = filteredDates.length / 7;
  let weekRange = [];
  for (let i = 1; i <= weekNums; i++) {
    let weekRangeItem = {};
    weekRangeItem['startDate'] = filteredDates[(i - 1) * 7];
    weekRangeItem['endDate'] = filteredDates[i * 7 - 1];
    weekRange.push(weekRangeItem);
  }
  let weeklyResults = [];
  for (let i = 0; i < weekRange.length; i++) {
    const singleWeekResult = filteredData.filter( (item) => {
      return parseInt(item['Date']) >= weekRange[i]['startDate'] && parseInt(item['Date']) <= weekRange[i]['endDate'];
    });
    weeklyResults.push(singleWeekResult);
  }
  // console.log(weeklyResults);
  let processedResults = [];
  for (let i = 0; i < weeklyResults.length; i++) {
    const singleWeek = weeklyResults[i];
    let singleWeekResult = {};
    singleWeek.forEach((item) => {
      const sessions = parseInt(item['Sessions']);
      if (!singleWeekResult[item['Traffic Type']]) {
        singleWeekResult[item['Traffic Type']] = sessions;
      } else if (singleWeekResult[item['Traffic Type']] < sessions) {
        singleWeekResult[item['Traffic Type']] = sessions;
      }
    });
    processedResults.push(singleWeekResult);
  }
  // console.log(processedResults);
  totalResults[fileId] = processedResults;
  console.log(totalResults);  
});

app.get('/maximum-sessions/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  console.log(fileId);
  const requestedResult = totalResults[fileId];
  console.log(requestedResult);
  res.json(requestedResult);
});

app.listen(PORT, () => {
  console.log(`Weekly Maximum Sessions listening on port ${PORT}...`);
});