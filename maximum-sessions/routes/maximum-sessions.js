const totalResults = {};

/* ------------- Save Maximum Sessions data ------------ */

const post = (req, res) => {
  const fileId = req.body.fileId;
  const filteredData = req.body.filteredData;
  const filteredDates = req.body.filteredDates;
  const weekNums = filteredDates.length / 7;
  
  totalResults[fileId] = null;
  
  // Generate each week's startDate and endDate
  let weekRange = [];
  for (let i = 1; i <= weekNums; i++) {
    let weekRangeItem = {};
    weekRangeItem['startDate'] = filteredDates[(i - 1) * 7];
    weekRangeItem['endDate'] = filteredDates[i * 7 - 1];
    weekRange.push(weekRangeItem);
  }
  
  // Based on weekRange to create an array to store each week's results
  let weeklyResults = [];
  for (let i = 0; i < weekRange.length; i++) {
    const singleWeekResult = filteredData.filter( (item) => {
      return parseInt(item['Date']) >= weekRange[i]['startDate'] && parseInt(item['Date']) <= weekRange[i]['endDate'];
    });
    weeklyResults.push(singleWeekResult);
  }
  
  // Mapping to generate each week's maximum sessions for each type
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
  
  // Use setTimeout to simulate processing time
  setTimeout(() => {
    totalResults[fileId] = processedResults;
    res.json({processingFinished: true})
  }, 8000);
  console.log(totalResults);  
};

/* ------------- Retrieve Maximum Sessions data ------------ */

const get = (req, res) => {
  const fileId = req.params.fileId;
  
  if (fileId in totalResults) {
    const requestedResult = totalResults[fileId];
    console.log(requestedResult);
    if (requestedResult === null) {
      res.json({hasId: true, processingFinished: false});
    } else {
      res.json({hasId: true, processingFinished: true, requestedResult});
    }
  } else {
    res.json({hasId: false});
  }
};

module.exports = { post, get };
