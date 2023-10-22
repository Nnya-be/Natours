const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());

// Calling the morgan middleware for testing
app.use(morgan('dev'));

//Creating my own middleware
app.use((req, res, next) => {
  console.log('Hey this is my middleware');
  next();
});

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Bad Request',
      message: 'Failed to patch',
    });
  }
  res.status(200).json({
    status: 'success',
    message: 'It was updated successfully',
    data: {
      tour: 'Updated part',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: "Couldn't find the tour",
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// Adding the user functions
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
// Getting users
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

//Creating new users
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

//updating users
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

//Deleting user
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const tourRouter = express.Router();
const userRouter = express.Router();
//Reading the tours json file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//starting up a server
const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port:${port}`);
});

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
