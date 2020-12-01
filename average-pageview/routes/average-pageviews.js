const averagePageviewsServices = require('../services/average-pageviews');

/* ------------- Save Average Pageviews data ------------ */

const post = (req, res) => {
  const fileId = req.body.fileId;
  const filteredData = req.body.filteredData;
  const days = req.body.days;

  // Save data
  averagePageviewsServices.saveData(fileId, filteredData, days);
  
  res.status(200).json({message: 'Average Pageviews data is being processed'});
};

/* ----------- Retrieve Average Pageview data ----------- */

const get = (req, res) => {
  const fileId = req.params.fileId;
  
  // Checking if the fileId is correct
  if (averagePageviewsServices.hasFileId(fileId)) {
    // Checking if the data is still being processed
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
