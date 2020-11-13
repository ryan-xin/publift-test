const totalResults = {};

const post = (req, res) => {
  const fileId = req.body.fileId;
  const filteredData = req.body.filteredData;
  const days = 31;
  totalResults[fileId] = null;
  let processedResults = {};
  filteredData.forEach((item) => {
    Number(Math.round(1.005+'e2')+'e-2');
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
