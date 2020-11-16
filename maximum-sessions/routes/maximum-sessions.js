const maximumSessionsServices = require('../services/maximum-sessions');

/* ------------- Save Maximum Sessions data ------------ */

const post = (req, res) => {
  const fileId = req.body.fileId;
  const filteredData = req.body.filteredData;
  const filteredDates = req.body.filteredDates;
  
  // Save data
  maximumSessionsServices.saveData(fileId, filteredData, filteredDates);
  
  res.status(200).json({message: 'Weekly Maximum Sessions data is being processed'});
};

/* ------------- Retrieve Maximum Sessions data ------------ */

const get = (req, res) => {
  const fileId = req.params.fileId;
  
  if (maximumSessionsServices.hasFileId(fileId)) {
    if (maximumSessionsServices.dataNotSaved(fileId)) {
      res.json({hasId: true, processingFinished: false});
    } else {
      const requestedResult = maximumSessionsServices.getData(fileId);
      console.log(requestedResult);
      res.json({hasId: true, processingFinished: true, requestedResult});
    }
  } else {
    res.json({hasId: false});
  }
};

module.exports = { post, get };
