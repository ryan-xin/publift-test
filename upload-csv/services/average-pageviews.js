// Filter 'Traffic Type' and 'Pageviews' columns
const generateFilteredData = (jsonObject) => {
  return jsonObject.map((item) => {
    const dataRow = {};
    dataRow['Traffic Type'] = item['Traffic Type'];
    dataRow['Pageviews'] = item['Pageviews'];
    return dataRow;
  });
};

// Generate unique days number
const generateFilteredDays = (jsonObject) => {
  // use dates to store all dates in csv
  const dates = jsonObject.map((item) => {
    return item['Date'];
  });
  // Remove duplicated dates
  return [...new Set(dates)];
};

module.exports = { generateFilteredData, generateFilteredDays };