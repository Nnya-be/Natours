const express = require('express');

const app = express();

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
//starting up a server
const port = 3000;
app.listen(port , () => {
    console.log(`App is listening on the ${port}`);
});

