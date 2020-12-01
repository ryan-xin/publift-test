// For checking if the fileId is correct
const checkFileId = (fileId, totalResults) => {
  if (fileId in totalResults) {
    return true;
  } else {
    return false;
  }
};

// For checking if the data is still being processed
const checkData = (fileId, totalResults) => {
  const requestedResult = totalResults[fileId];
  // Still being processed
  if (requestedResult === null) {
    return true;
  // Finished processing
  } else {
    return false;
  }
};

module.exports = { checkFileId, checkData };