const getResults = require('../../_helper/get-results');

const totalResults = {};

const saveData = (fileId, filteredData, days) => {
  // Save the fileId as the key and set value to null so we can show the data is still processing
  totalResults[fileId] = null;
  
  let processedResults = {};
  filteredData.forEach((item) => {
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
  
  // Use setTimeout to simulate processing time
  setTimeout(() => {
    totalResults[fileId] = processedResults;
  }, 9000);
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
