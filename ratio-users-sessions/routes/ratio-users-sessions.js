const totalResults = {};

const post = (req, res) => {
  const fileId = req.body.fileId;
  const filteredData = req.body.filteredData;
  totalResults[fileId] = null;
  let processedResults = 0;
  let users = 0;
  let sessions = 0;
  filteredData.forEach((item) => {
    users += item['Users'];
    sessions += item['Sessions'];
  });
  processedResults = (sessions / users).toFixed(2);
  setTimeout(() => {totalResults[fileId] = processedResults}, 20000);
  console.log(totalResults);  
};

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