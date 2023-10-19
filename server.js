const express = require('express'); 
const app = express();
const PORT = process.env.PORT || 3500;
const path = require('path');

app.use(express.static(path.join(__dirname, '/public'))); // for static files - css

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')) {
        res.json({error: 'Not found'});
    } else {
        res.type('txt').send('404 Not found');
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});