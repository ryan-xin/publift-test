const totalResults = {};

/* ------------- Save Average Pageviews data ------------ */

const post = (req, res) => {
  const fileId = req.body.fileId;
  const filteredData = req.body.filteredData;
  const days = req.body.days;
  
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
    res.json({processingFinished: true});
  }, 7000);
  console.log(totalResults);
};

/* ----------- Retrieve Average Pageview data ----------- */

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
