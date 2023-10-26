const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({
  path: './config.env',
});

const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((con) => {
    console.log(con.connections);
    console.log('DB connected');
  });
const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port:${port}`);
});
