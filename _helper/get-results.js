const checkFileId = (fileId, totalResults) => {
  if (fileId in totalResults) {
    return true;
  } else {
    return false;
  }
};

const checkData = (fileId, totalResults) => {
  const requestedResult = totalResults[fileId];
  if (requestedResult === null) {
    return true;
  } else {
    return false;
  }
};

module.exports = { checkFileId, checkData };