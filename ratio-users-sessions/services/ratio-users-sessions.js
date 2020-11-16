const getResults = require('../../_helper/get-results');

const totalResults = {};

const saveData = (fileId, filteredData) => {
  
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
  }, 6000);
  console.log(totalResults);
};

const hasFileId = (fileId) => {
  return getResults.checkFileId(fileId, totalResults);
};

const dataNotSaved = (fileId) => {
  return getResults.checkData(fileId, totalResults);
};

const getData = (fileId) => {
  return totalResults[fileId];
};

module.exports = { saveData, hasFileId, dataNotSaved, getData };
