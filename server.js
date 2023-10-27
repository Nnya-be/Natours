const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
  path: './config.env',
});
const app = require('./app');

const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);
mongoose.connect(
  DB,{
    useNewUrlParser: true,
      useUnifiedTopology: true,
  }
);

const tourSchema = new mongoose.Schema({
  
})

// .then((con) => {
//   console.log(con.connections);
//   console.log('DB connected');
// });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port:${port}`);
});
