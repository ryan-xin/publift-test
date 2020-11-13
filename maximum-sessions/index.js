const express = require('express');
const app = express();

const PORT = process.env.PORT || 8004;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const route = require('./routes/maximum-sessions');

app.post('/maximum-sessions', route.post);

app.get('/maximum-sessions/:fileId', route.get);

app.listen(PORT, () => {
  console.log(`Weekly Maximum Sessions listening on port ${PORT}...`);
});