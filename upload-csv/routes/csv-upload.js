const fs = require('fs');
const csv = require('csvtojson');

const axios = require('axios');

const averagePageviewsServices = require('../services/average-pageviews');
const ratioUsersSessionsServices = require('../services/ratio-users-sessions');
const maximumSessionsServices = require('../services/maximum-sessions');

const upload = (req, res) => {
  csv()
  .fromFile(req.file.path)
  .then( async (jsonObject) => {
    const fileId = req.file.filename;
    
    // Send unique id to user
    res.json({fileId: fileId});
    
    const averagePageviewEndpoint = 'http://localhost:8002/average-pageviews';
    const ratioUsersSessionsEndpoint = 'http://localhost:8003/ratio-users-sessions';
    const maximumSessionsEndpoint = 'http://localhost:8004/maximum-sessions';

    const averagePageviews = averagePageviewsServices.generateFilteredData(jsonObject);
    const days = averagePageviewsServices.generateFilteredDays(jsonObject).length;
    
    const ratioUsersSessions = ratioUsersSessionsServices.generateFilteredData(jsonObject);

    const filteredDates = maximumSessionsServices.generateFilteredDates(jsonObject);
    const maximumSessions = maximumSessionsServices.generateFilteredData(jsonObject, filteredDates);

    axios.all([
      axios.post(averagePageviewEndpoint, {
        filteredData: averagePageviews,
        fileId: fileId,
        days: days
      }),
      axios.post(ratioUsersSessionsEndpoint, {
        filteredData: ratioUsersSessions,
        fileId: fileId
      }),
      axios.post(maximumSessionsEndpoint, {
        filteredData: maximumSessions,
        fileId: fileId,
        filteredDates: filteredDates
      })
    ]);

    // Delete temp csv file 
    fs.unlinkSync(req.file.path);
  })
};

module.exports = { upload };