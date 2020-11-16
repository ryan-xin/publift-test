const ratioUsersSessionsServices = require('../services/ratio-users-sessions');

/* ------------- Save Ratio Users & Sessions data ------------ */

const post = (req, res) => {
  const fileId = req.body.fileId;
  const filteredData = req.body.filteredData;
  
  // Save data
  ratioUsersSessionsServices.saveData(fileId, filteredData);
  
  res.status(200).json({message: 'Ratio of Users and Sessions data is being processed.'});
};

/* ------------- Retrieve Ratio Users & Sessions data ------------ */

const get = (req, res) => {
  const fileId = req.params.fileId;
  
  if (ratioUsersSessionsServices.hasFileId(fileId)) {
    if (ratioUsersSessionsServices.dataNotSaved(fileId)) {
      res.json({hasId: true, processingFinished: false});
    } else {
      const requestedResult = ratioUsersSessionsServices.getData(fileId);
      console.log(requestedResult);
      res.json({hasId: true, processingFinished: true, requestedResult});
    }
  } else {
    res.json({hasId: false});
  }
};

module.exports = { post, get };