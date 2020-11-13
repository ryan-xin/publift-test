const axios = require('axios');

const results = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const [responseOne, responseTwo, responseThree] = await axios.all([
      axios.get(`http://localhost:8002/average-pageviews/${fileId}`),
      axios.get(`http://localhost:8003/ratio-users-sessions/${fileId}`),
      axios.get(`http://localhost:8004/maximum-sessions/${fileId}`)
    ])

    if (responseOne.data.hasId === true && responseTwo.data.hasId === true && responseThree.data.hasId === true) {
      if (responseOne.data.processingFinished === true && responseTwo.data.processingFinished === true && responseThree.data.processingFinished === true) {
        res.json({
          averagePageviews: responseOne.data.requestedResult, 
          ratioUsersSessions: responseTwo.data.requestedResult, 
          maximumSessions: responseThree.data.requestedResult
        });
      } else {
        res.json({
          message: 'We are still processing your file. Please come back later.'
        });
      }
    } else {
      res.json({
        message: 'File ID is incorrect. Please try again.'
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      message: 'System error. Please try again.'
    });
  };
};

module.exports = { results };