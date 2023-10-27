const fs = require('fs');
const tourModel = require('../models/tourModel');

exports.checkBody = (req, res, next) => {
  // const body = req.body.name;
  // const price = req.body.price;
  // if (!body || !price) {
  //   return res.status(400).json({
  //     status: 'failed',
  //     message: 'Trying to create a tour without a body or price',
  //   });
  // }

  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  });
};

exports.createTour = (req, res) => {
  // const newID = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newID }, req.body);

  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   },
  // );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'It was updated successfully',
    data: {
      tour: 'Updated part',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
