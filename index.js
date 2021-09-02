require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// const postsRoutes = require('');
// true
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
// cd;
// ?.
const port = process.env.PORT || 5011;

mongoose
   .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
   })
   .then(() => {
      console.log('Connected to db');
      app.listen(port, () => console.log(`Server started on port ${port}`));
   })
   .catch((e) => console.log(e));
