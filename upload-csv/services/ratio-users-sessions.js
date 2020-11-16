// Filter 'Users' and 'Sessions' columns
const generateFilteredData = (jsonObject) => {
  return jsonObject.map((item) => {
    const dataRow = {};
    dataRow['Users'] = item['Users'];
    dataRow['Sessions'] = item['Sessions'];
    return dataRow;
  });
};

module.exports = { generateFilteredData };