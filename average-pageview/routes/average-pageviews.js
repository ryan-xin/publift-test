// const totalResults = {};

const averagePageviewsServices = require('../services/average-pageviews');

/* ------------- Save Average Pageviews data ------------ */

const post = (req, res) => {
  const fileId = req.body.fileId;
  const filteredData = req.body.filteredData;
  const days = req.body.days;

  averagePageviewsServices.saveData(fileId, filteredData, days);
  
  res.json({message: 'Average Pageviews data saved.'});
};

/* ----------- Retrieve Average Pageview data ----------- */

const get = (req, res) => {
  const fileId = req.params.fileId;
  
  if (averagePageviewsServices.hasFileId(fileId)) {
    if (averagePageviewsServices.dataNotSaved(fileId)) {
      res.json({hasId: true, processingFinished: false});
    } else {
      const requestedResult = averagePageviewsServices.getData(fileId);
      console.log(requestedResult);
      res.json({hasId: true, processingFinished: true, requestedResult});
    }
  } else {
    res.json({hasId: false});
  }
};

module.exports = { post, get };
