const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());



//Reading the tours json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//Handling the get request of the server
app.get('/api/v1/tours', (req, res)=>{
    res.status(200).json({
        status: "success",
        results:tours.length,
        data: {
            tours
        }
    })
});


//Handling routes with an id
app.get('/api/v1/tours/:id', (req, res)=>{
    console.log(req.params);
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (!tour){
        return res.status(404).json({
            status: 'fail',
            message: "Invalid ID"
        })
    }


    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
});


//Handling the post request to the server
app.post('/api/v1/tours', (req, res)=>{
    const newID = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id: newID}, req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
        res.status(201).json({
            status : 'success',
            data:{
                tour: newTour
            }
        });
    });
});

//Handling the updating of the API
app.patch('/api/v1/tours/:id', (req,res)=>{
    if (req.params.id * 1 > tours.length){
        return res.status(404).json({
            status : 'Bad Request',
            message : "Failed to patch"
        })
    }
    res.status(200).json({
        status: 'success',
        message: "It was updated successfully",
        data:{
            tour : 'Updated part'
        }
    })
});

//Handling the Delete Request
app.delete('/api/v1/tours/:id', (req, res) =>{
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "Fail",
            message : "Couldn't find the tour"
        });
    }

    res.status(204).json({
        status : 'success',
        data : null
    });
});

//starting up a server
const port = 3000;
app.listen(port , () => {
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

*/