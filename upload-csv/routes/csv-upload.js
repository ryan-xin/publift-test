const fs = require('fs');
const csv = require('csvtojson');

const axios = require('axios');

const upload = (req, res) => {
  csv()
  .fromFile(req.file.path)
  .then( async (jsonObject) => {
    try {
      const fileId = req.file.filename;
      // Send unique id to user
      res.json({fileId: fileId});
      
      const averagePageviewEndpoint = 'http://localhost:8002/average-pageviews';
      const ratioUsersSessionsEndpoint = 'http://localhost:8003/ratio-users-sessions';
      const maximumSessionsEndpoint = 'http://localhost:8004/maximum-sessions';

      const averagePageviews = generateAveragePageviews(jsonObject);
      const days = generateDays(jsonObject).length;
      
      const ratioUsersSessions = generateRatioUsersSessions(jsonObject);

      const filteredDates = generateFilteredDates(jsonObject);
      const maximumSessions = generateMaximumSessions(jsonObject, filteredDates);

      const [responseOne, responseTwo, responseThree] = await axios.all([
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
      
      if (responseOne.data.processingFinished === true && responseTwo.data.processingFinished === true && responseThree.data.processingFinished === true) {
        console.log('Data processing finished.');
        // TODO: send response to front-end
      }
      
      // Delete temp csv file 
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.log(err);
      res.json({
        message: 'System error. Please try again.'
      });      
    }
  })
};

// Filter 'Traffic Type' and 'Pageviews' columns
function generateAveragePageviews(jsonObject) {
  return jsonObject.map((item) => {
    const dataRow = {};
    dataRow['Traffic Type'] = item['Traffic Type'];
    dataRow['Pageviews'] = item['Pageviews'];
    return dataRow;
  });
};

// Filter 'Users' and 'Sessions' columns
function generateRatioUsersSessions(jsonObject) {
  return jsonObject.map((item) => {
    const dataRow = {};
    dataRow['Users'] = item['Users'];
    dataRow['Sessions'] = item['Sessions'];
    return dataRow;
  });
};

function generateDays(jsonObject) {
  // use dates to store all dates in csv
  const dates = jsonObject.map( (item) => {
    return item['Date'];
  });
  // Remove duplicated dates
  return [...new Set(dates)];
};

// Generate completed week days of csv
function generateFilteredDates(jsonObject) {
  const uniqueDates = generateDays(jsonObject);
  const orderedUniqueDates = uniqueDates.sort();
  let filteredDates = [];
  let firstSundayIndex;
  // Generate first Sunday index
  for (let i = 0; i < orderedUniqueDates.length; i++) {
    const item = orderedUniqueDates[i];
    const year = parseInt(item.substring(0,4));
    const month = parseInt(item.substr(4, 2)) - 1;
    const day = parseInt(item.substr(-2));
    const weekday = (new Date(year, month, day)).getDay();
    if (weekday === 0) {
      firstSundayIndex = i;
      break;
    }
  }
  // Remove uncomplete weekdays from the end of dates array
  for (let i = orderedUniqueDates.length - 1; i >= 0; i--) {
    const item = orderedUniqueDates[i];
    const year = parseInt(item.substring(0,4));
    const month = parseInt(item.substr(4, 2)) - 1;
    const day = parseInt(item.substr(-2));
    const weekday = (new Date(year, month, day)).getDay();
    if (orderedUniqueDates[orderedUniqueDates.length - 1] === 6) {
      filteredDates = orderedUniqueDates.slice(firstSundayIndex);
      break;
    }
    if (weekday === 0) {
      filteredDates = orderedUniqueDates.slice(firstSundayIndex, i);
      break;
    }
  }
  return filteredDates;
};

// Filter complete week days and 'Date', 'Traffic Type' and 'Sessions'
function generateMaximumSessions(jsonObject, filteredDates) {
  // Use filteredDates to filter unneeded rows
  const filteredJsonObject = jsonObject.filter( (item) => {
    return parseInt(item['Date']) >= parseInt(filteredDates[0]) && 
    parseInt(item['Date']) <= parseInt(filteredDates[filteredDates.length - 1]);
  });
  return filteredJsonObject.map( (item) => {
    const dataRow = {};
    dataRow['Date'] = item['Date'];
    dataRow['Traffic Type'] = item['Traffic Type'];
    dataRow['Sessions'] = item['Sessions'];
    return dataRow;
  });
};

module.exports = { upload };