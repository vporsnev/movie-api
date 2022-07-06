const express = require('express'),
       bodyParser = require('body-parser'),
       methodOverride = require('method-override');
       morgan = require('morgan');
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use(morgan('common'));

let topMovies = [
  {
    title: 'The Shawshank Redemption',
    year: '1994',
    director: 'Frank Darabont'
  },
  {
    title: 'Pulp Fiction',
    year: '1994',
    director: 'Quentin Tarantino'
  },
  {
    title: 'Forrest Gump',
    year: '1994',
    director: 'Robert Zemeckis'
  },
  {
    title: 'Fight Club',
    year: '1999',
    director: 'David Fincher'
  },
  {
    title: 'One Flew Over the Cuckoo\'s Nest',
    year: '1975',
    director: 'Milos Forman'
  },
  {
    title: 'Se7en',
    year: '1995',
    director: 'David Fincher'
  },
  {
    title: 'The Green Mile',
    year: '1999',
    director: 'Frank Darabont'
  },
  {
    title: 'Back to the Future',
    year: '1985',
    director: 'Robert Zemeckis'
  },
  {
    title: '1+1',
    year: '2011',
    director: 'Olivier Nakache'
  },
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie app!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use('/documentation', express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
