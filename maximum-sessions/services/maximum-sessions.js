const getResults = require('../../_helper/get-results');

// To store all processed results, fileId is the key & data is the value
const totalResults = {};

const saveData = (fileId, filteredData, filteredDates) => {
  // Save the fileId as the key and set value to null so we can show the data is still processing
  totalResults[fileId] = null;
  
  // Get how many weeks this data has
  const weekNums = filteredDates.length / 7;
  
  // Generate each week's startDate and endDate
  let weekRange = [];
  for (let i = 1; i <= weekNums; i++) {
    let weekRangeItem = {};
    weekRangeItem['startDate'] = filteredDates[(i - 1) * 7];
    weekRangeItem['endDate'] = filteredDates[i * 7 - 1];
    weekRange.push(weekRangeItem);
  }
  
  // Based on weekRange to create an array to separate each week's results
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
      // Initialize the first session value
      if (!singleWeekResult[item['Traffic Type']]) {
        singleWeekResult[item['Traffic Type']] = sessions;
      // Compare and save the larger session value
      } else if (singleWeekResult[item['Traffic Type']] < sessions) {
        singleWeekResult[item['Traffic Type']] = sessions;
      }
    });
    processedResults.push(singleWeekResult);
  }
  
  // Use setTimeout to simulate processing time
  setTimeout(() => {
    totalResults[fileId] = processedResults;
  }, 10000);
  console.log(totalResults);  
};

const hasFileId = (fileId) => {
  // Call helper functions
  return getResults.checkFileId(fileId, totalResults);
};

const dataNotSaved = (fileId) => {
  // Call helper functions
  return getResults.checkData(fileId, totalResults);
};

const getData = (fileId) => {
  return totalResults[fileId];
};

module.exports = { saveData, hasFileId, dataNotSaved, getData };
