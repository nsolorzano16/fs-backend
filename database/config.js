const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    mongoose.connect(process.env.DB_CON, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('DB ONLINE');
  } catch (error) {
    console.log(error);
    throw new Error('Error initialize database');
  }
};

module.exports = {
  dbConnection,
};
