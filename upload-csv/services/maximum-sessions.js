const averagePageviewsServices = require('./average-pageviews');

// Generate completed week days of csv
function generateFilteredDates(jsonObject) {
  const uniqueDates = averagePageviewsServices.generateFilteredDays(jsonObject);
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
const generateFilteredData = (jsonObject, filteredDates) => {
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

module.exports = { generateFilteredData, generateFilteredDates };
