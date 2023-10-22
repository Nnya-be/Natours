
const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use(express.json());

// Calling the morgan middleware for testing
app.use(morgan('dev'));

//Creating my own middleware
app.use((req, res, next) => {
  console.log('Hey this is my middleware');
  next();
});


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
//starting up a server

/** 
//basic routing
app.get('/', (req, res)=>{
    res.status(200).json(
        {
            message: "Hello from my server!",
            app: "Natours"
        }
        );
});


app.post('/', (req, res)=>{
    res.send('You can post to this endpoint');
});

//Handling the get request of the server
app.get('/api/v1/tours', getAllTours);


//Handling routes with an id
app.get('/api/v1/tours/:id',getTour);


//Handling the post request to the server
app.post('/api/v1/tours', createTour);

//Handling the updating of the API
app.patch('/api/v1/tours/:id', updateTour);

//Handling the Delete Request
app.delete('/api/v1/tours/:id', deleteTour);

*/
