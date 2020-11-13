const express = require('express');
const app = express();

const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

/* --------------------- CSV Upload --------------------- */

const csvUploadRoute = require('./routes/csv-upload');
app.post('/csv-upload', upload.single('csv'), csvUploadRoute.upload);

/* --------------------- CSV Results -------------------- */

const csvResultsRoute = require('./routes/csv-results.js');
app.get('/csv-results/:fileId', csvResultsRoute.results);

app.listen(PORT, () => {
  console.log(`Upload CSV listening on port ${PORT}...`);
});