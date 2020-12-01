const getResults = require('../../_helper/get-results');

// To store all processed results, fileId is the key & data is the value
const totalResults = {};

const saveData = (fileId, filteredData) => {
  // Save the fileId as the key and set value to null so we can show the data is still processing
  totalResults[fileId] = null;
  
  let processedResults = 0;
  let users = 0;
  let sessions = 0;
  filteredData.forEach((item) => {
    users += item['Users'];
    sessions += item['Sessions'];
  });
  processedResults = (sessions / users).toFixed(2);
  
  // Use setTimeout to simulate processing time
  setTimeout(() => {
    totalResults[fileId] = processedResults;
  }, 8000);
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
