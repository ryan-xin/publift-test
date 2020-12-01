const getResults = require('../../_helper/get-results');

// To store all processed results, fileId is the key & data is the value
const totalResults = {};

const saveData = (fileId, filteredData, days) => {
  // Save the fileId as the key and set value to null so we can show the data is still processing
  totalResults[fileId] = null;
  
  let processedResults = {};
  // Construct total pageviews for each traffic type
  filteredData.forEach((item) => {
    const views = parseInt(item['Pageviews']);
    // If the current traffic type has existed, add current to the value
    if (processedResults[item['Traffic Type']] >= 0) {
      processedResults[item['Traffic Type']] += views;
    // Else create the current traffic type
    } else {
      processedResults[item['Traffic Type']] = views;
    }
  });
  // Divide each traffic type results by days and make each result with two decimals
  for (let key of Object.keys(processedResults)) {
    processedResults[key] = Math.round((processedResults[key] / days) * 100) / 100;
  }
  
  // Use setTimeout to simulate processing time
  setTimeout(() => {
    totalResults[fileId] = processedResults;
  }, 9000);
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
