const express = require('express');
const app = express();

const PORT = process.env.PORT || 8002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const route = require('./routes/average-pageviews');

app.post('/average-pageviews', route.post);

app.get('/average-pageviews/:fileId', route.get);

app.listen(PORT, () => {
  console.log(`Average Pageview listening on port ${PORT}...`);
});