const averagePageviewsServices = require('./average-pageviews');

// Generate completed week days of csv
const generateFilteredDates = (jsonObject) => {
  // Get all unique dates in an array
  const uniqueDates = averagePageviewsServices.generateFilteredDays(jsonObject);
  // Sort all the dates
  const orderedUniqueDates = uniqueDates.sort();
  let filteredDates = [];
  let firstSundayIndex;
  
  // Generate first Sunday index (week starts on Sunday)
  for (let i = 0; i < orderedUniqueDates.length; i++) {
    const item = orderedUniqueDates[i];
    const year = parseInt(item.substring(0,4));
    const month = parseInt(item.substr(4, 2)) - 1;
    const day = parseInt(item.substr(-2));
    const weekday = (new Date(year, month, day)).getDay();
    // Get the first Sunday index and end the loop
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
    // If the last date is Saturday(no need to remove from the end) end the loop
    if (orderedUniqueDates[orderedUniqueDates.length - 1] === 6) {
      // Using the first Sunday index to slice the dates and generate all completed weeks
      filteredDates = orderedUniqueDates.slice(firstSundayIndex);
      break;
    }
    if (weekday === 0) {
      // Using the first Sunday index and last Sunday index to slice the dates and generate all completed weeks
      filteredDates = orderedUniqueDates.slice(firstSundayIndex, i);
      break;
    }
  }
  return filteredDates;
};

// Filter complete week days and 'Date', 'Traffic Type' and 'Sessions'
const generateFilteredData = (jsonObject, filteredDates) => {
  // Use filteredDates to filter unneeded rows (remove uncompleted days)
  const filteredJsonObject = jsonObject.filter( (item) => {
    return parseInt(item['Date']) >= parseInt(filteredDates[0]) && 
    parseInt(item['Date']) <= parseInt(filteredDates[filteredDates.length - 1]);
  });
  // Filter needed columns
  return filteredJsonObject.map( (item) => {
    const dataRow = {};
    dataRow['Date'] = item['Date'];
    dataRow['Traffic Type'] = item['Traffic Type'];
    dataRow['Sessions'] = item['Sessions'];
    return dataRow;
  });
};

module.exports = { generateFilteredData, generateFilteredDates };
