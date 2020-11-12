const express = require('express');
const app = express();

const PORT = process.env.PORT || 8001;

const axios = require('axios');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const csv = require('csvtojson');

app.post('/upload-csv', upload.single('csv'), (req, res) => {
  csv()
  .fromFile(req.file.path)
  .then((jsonObject) => {
    // console.log(req.file);
    
    const fileId = req.file.filename;
    
    /* ------------------ Average Pageview ------------------ */
    
    const averagePageview = jsonObject.map( (item) => {
      const dataRow = {};
      dataRow['Traffic Type'] = item['Traffic Type'];
      dataRow['Pageviews'] = item['Pageviews'];
      return dataRow;
    });
    // console.log(averagePageview);
    axios.post('http://localhost:8002/average-pageviews', {
      filteredData: averagePageview,
      fileId: fileId
    })
    .then(res => {
      console.log(res.data);
    })
    .catch(err => console.log(err));
    
    /* ---------------- Ratio Users Sessions ---------------- */
    
    const ratioUsersSessions = jsonObject.map( (item) => {
      const dataRow = {};
      dataRow['Users'] = item['Users'];
      dataRow['Sessions'] = item['Sessions'];
      return dataRow;
    });
    // console.log(ratioUsersSessions);
    axios.post('http://localhost:8003/ratio-users-sessions', {
      filteredData: ratioUsersSessions,
      fileId: fileId
    })
    .then(res => {
      console.log(res.data);
    })
    .catch(err => console.log(err));
    
    /* ------------------ Maximum Sessions ------------------ */

    const dates = jsonObject.map( (item) => {
      return item['Date'];
    });
    const uniqueDates = [...new Set(dates)]
    const orderedUniqueDates = uniqueDates.sort();
    let firstSundayIndex;
    let filteredDates = [];
    for (let i = 0; i < orderedUniqueDates.length; i++) {
      const item = orderedUniqueDates[i];
      const year = parseInt(item.substring(0,4));
      const month = parseInt(item.substr(4, 2)) - 1;
      const day = parseInt(item.substr(-2));
      const weekday = (new Date(year, month, day)).getDay();
      if (weekday === 0) {
        firstSundayIndex = i;
        console.log(i);
        break;
      }
    }
    for (let i = orderedUniqueDates.length - 1; i >= 0; i--) {
      const item = orderedUniqueDates[i];
      const year = parseInt(item.substring(0,4));
      const month = parseInt(item.substr(4, 2)) - 1;
      const day = parseInt(item.substr(-2));
      const weekday = (new Date(year, month, day)).getDay();
      if (orderedUniqueDates[orderedUniqueDates.length - 1] === 6) {
        filteredDates = orderedUniqueDates.slice(firstSundayIndex);
        console.log(orderedUniqueDates.length - 1);
        break;
      }
      if (weekday === 0) {
        filteredDates = orderedUniqueDates.slice(firstSundayIndex, i);
        console.log(i);
        break;
      }
    }
    // console.log(filteredDates);
    const filteredJsonObject = jsonObject.filter( (item) => {
      return parseInt(item['Date']) >= parseInt(filteredDates[0]) && parseInt(item['Date']) <= parseInt(filteredDates[filteredDates.length - 1]);
    });
    const maximumSessions = filteredJsonObject.map( (item) => {
      const dataRow = {};
      dataRow['Date'] = item['Date'];
      dataRow['Traffic Type'] = item['Traffic Type'];
      dataRow['Sessions'] = item['Sessions'];
      return dataRow;
    });    
    console.log(maximumSessions);
    axios.post('http://localhost:8004/maximum-sessions', {
      filteredData: maximumSessions,
      fileId: fileId,
      filteredDates: filteredDates
    })
    .then(res => {
      console.log(res.data);
    })
    .catch(err => console.log(err));
    
    /* ---------------- Delete temp csv file ---------------- */
    
    fs.unlinkSync(req.file.path);
    
    /* ----------------- Send unique FileId ----------------- */
    
    res.json({fileId: fileId});
  })
});

app.get('/csv-results/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const [responseOne, responseTwo, responseThree] = await axios.all([
      axios.get(`http://localhost:8002/average-pageviews/${fileId}`),
      axios.get(`http://localhost:8003/ratio-users-sessions/${fileId}`),
      axios.get(`http://localhost:8004/maximum-sessions/${fileId}`)
    ])

    if (responseOne.data.processingFinished === true && responseTwo.data.processingFinished === true && responseThree.data.processingFinished === true) {
      res.json({
        averagePageview: responseOne.data.requestedResult, 
        ratioUsersSessions: responseTwo.data.requestedResult, 
        maximumSessions: responseThree.data.requestedResult
      });
    } else {
      res.json({
        message: 'We are still processing your file. Please come back later.'
      })
    }
    
  } catch (err) {
    console.log(err);
  };
});

app.listen(PORT, () => {
  console.log(`Upload CSV listening on port ${PORT}...`);
});