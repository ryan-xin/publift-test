const express = require('express');
const app = express();

const PORT = process.env.PORT || 8003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const route = require('./routes/ratio-users-sessions');

app.post('/ratio-users-sessions', route.post);

app.get('/ratio-users-sessions/:fileId', route.get);

app.listen(PORT, () => {
  console.log(`Ratio Users & Sessions listening on port ${PORT}...`);
});