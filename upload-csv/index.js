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
// const path = require('path');
// const csv = require('fast-csv');

app.post('/upload-csv', upload.single('csv'), (req, res) => {
  csv()
  .fromFile(req.file.path)
  .then((jsonObject) => {
    console.log(req.file);
    
    const fileId = req.file.filename;
    
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
    
    const ratioUsersSessions = jsonObject.map( (item) => {
      const dataRow = {};
      dataRow['Users'] = item['Users'];
      dataRow['Sessions'] = item['Sessions'];
      return dataRow;
    });
    console.log(ratioUsersSessions);
    axios.post('http://localhost:8003/ratio-users-sessions', {
      filteredData: ratioUsersSessions,
      fileId: fileId
    })
    .then(res => {
      console.log(res.data);
    })
    .catch(err => console.log(err));
    
    fs.unlinkSync(req.file.path);
    
    res.json({fileId: fileId});
  })
});

app.get('/csv-results/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  console.log(fileId);
  let averagePageview;
  let ratioUsersSessions;
  
  axios.get(`http://localhost:8002/average-pageviews/${fileId}`)
  .then(res => {
    console.log(res.data);
    averagePageview = res.data;
  })
  .catch(err => console.log(err));

  axios.get(`http://localhost:8003/ratio-users-sessions/${fileId}`)
  .then(res => {
    console.log(res.data);
    ratioUsersSessions = res.data;
  })
  .catch(err => console.log(err));
  
  res.json({averagePageview, ratioUsersSessions});
});

app.listen(PORT, () => {
  console.log(`Upload CSV listening on port ${PORT}...`);
});