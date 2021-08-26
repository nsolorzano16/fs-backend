const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');

//create server
const app = express();

//database conn
dbConnection();

//cors
app.use(cors());

//public directory
app.use(express.static('public'));

//read and body parser
app.use(express.json());

//routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/category', require('./routes/categoriesRoute'));
app.use('/api/post', require('./routes/postsRoute'));

//listen
app.listen(process.env.PORT, () => {
  console.log(`Server running in port ${process.env.PORT}`);
});
