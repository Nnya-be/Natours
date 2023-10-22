const fs = require('fs');

//Reading the tours json file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
)
exports.getAllTours = (req, res) => {
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  };
  
exports.getTour = (req, res) => {
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
  
  exports.createTour = (req, res) => {
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
  
exports.updateTour = (req, res) => {
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
  
  exports.deleteTour = (req, res) => {
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
