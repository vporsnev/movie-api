const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  Models = require('./models.js');

const { check, validationResult } = require('express-validator');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Actors = Models.Actor;

const bodyParser = require('body-parser');
// methodOverride = require('method-override');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ //support parsing of application/x-www-form-urlencoded post data
  extended: true
}));

// mongoose.connect('mongodb://localhost:27017/myFlixDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

mongoose.connect( process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const {
  check,
  validationResult
} = require('express-validator');

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:50056', 'http://localhost:4200', 'https://myflixsify.netlify.app', 'https://vporsnev.github.io' ];
app.use(express.static('public'));
app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.use(morgan('combined')); // setup the logger, Mildware function to the terminal

app.use(express.static('public')); // Automatically routes all requests for static files to their corresponding files within a certain folder on the server
// support parsing of application/json type post data
// app.use(methodOverride());

// GET requests
// Welcome message
/**
 * GET welcome message from '/' endpoint
 * @name welcomeMessage
 * @kind function
 * @returns Welcome message
 */
app.get('/', (req, res) => {
  res.send('Welcome to my movie app!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {
    root: __dirname
  });
});

// READ all movies
/**
 * GET a list of all movies
 * Request body: Bearer Token
 * @name getAllMovies
 * @kind function
 * @returns array of movie objects
 * @requires passport
 */
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/users', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ a user by username
/**
 * GET user data on a single user
 * Request body: Bearer token
 * @name getUser
 * @kind function
 * @param Username
 * @returns user object
 * @requires passport
 */
app.get('/users/:username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOne({
      username: req.params.username
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/users/:username/movies', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOne({
      username: req.params.username
    })
    .then((user) => {
      res.json(user.favoriteMovies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ one movie by title
/**
 * GET data about a single movie by title
 * Request body: Bearer token
 * @name getMovie
 * @kind function
 * @param Title
 * @returns movie object
 * @requires passport
 */
app.get('/movies/:title', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.find({
      title: req.params.title
    })
    .then((movie) => {
      res.json(movie)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ All movies by genre
/**
 * GET movies by genre
 * Request body: Bearer token
 * @name getGenreAll
 * @kind function
 * @param genreName
 * @returns movie objects
 * @requires passport
 */
app.get('/movies/genre/all/:name', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.find({
      'genre.name': req.params.name
    })
    .then((movie) => {
      res.json(movie)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ genre by name
/**
 * GET data about a genre by genre name
 * Request body: Bearer token
 * @name getGenre
 * @kind function
 * @param genreName
 * @returns genre object
 * @requires passport
 */
app.get('/movies/genre/:genreName', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.findOne({
      'genre.name': req.params.genreName
    })
    .then((movie) => {
      res.json(movie.genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ All movies by director
/**
 * GET movies by director
 * Request body: Bearer token
 * @name getDirectorAll
 * @kind function
 * @param directorName
 * @returns movie objects
 * @requires passport
 */
app.get('/movies/directors/all/:name', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.find({
      'director.name': req.params.name
    })
    .then((movie) => {
      res.json(movie)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ director by name
/**
 * GET data about a director by name
 * Request body: Bearer token
 * @name getDirector
 * @kind function
 * @param directorName
 * @returns director object
 * @requires passport
 */
app.get('/movies/directors/:directorName', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.findOne({
      'director.name': req.params.directorName
    })
    .then((movie) => {
      res.json(movie.director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// POST requests
// CREATE new user
/**
 * POST new user. Username, password, and Email are required fields.
 * Request body: Bearer token, JSON with user information in this format:
 * {
 *  ID: Integer,
 *  Username: String,
 *  Password: String,
 *  Email: String,
 *  Birthday: Date
 * }
 * @name createUser
 * @kind function
 * @returns user object
 */
app.post('/users', [
  check('username', 'Username is required').isLength({min: 4}),
  check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('password', 'Password is required').not().isEmpty(),
  check('email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  let hashedPassword = Users.hashPassword(req.body.password);

  Users.findOne({
      username: req.body.username
    })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        Users
          .create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            birthday: req.body.birthday
          })
          .then((user) => {
            res.status(201).json(user)
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// PUT requests
// UPDATE user by username
/**
 * PUT new user info
 * Request body: Bearer token, updated user info in the following format:
 * {
 *  Username: String, (required)
 *  Password: String, (required)
 *  Email: String, (required)
 *  Birthday: Date
 * }
 * @name updateUser
 * @kind function
 * @param Username
 * @returns user object
 * @requires passport
 */
app.put('/users/:username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndUpdate({
      username: req.params.username
    }, {
      $set: {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
      }
    }, {
      new: true
    },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// UPDATE movie info
/**
 * PUT new movie info
 * Request body: updated movie info in the following format:
 * {
 *  Title: String,
 *  Year: String,
 *  Director: String,
 *  Genre: String
 *  Description: String,
 *  imageURL: String
 * }
 * @name updateMovie
 * @kind function
 * @param Title
 * @returns movie object
 */
app.put('/movies/:title', (req, res) => {
  Movies.findOneAndUpdate({
      title: req.params.title
    }, {
      $set: {
        title: req.body.title,
        year: req.body.year,
        director: req.body.director,
        genre: req.body.genre,
        actors: req.body.actors,
        description: req.body.description,
        imageURL: req.body.imageURL
      }
    }, {
      new: true
    },
    (err, updatedMovie) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedMovie);
      }
    });
});

// POST favorite movie for a user
/**
 * POST a movie to a user's list of favorites
 * Request body: Bearer token
 * @name createFavorite
 * @kind function
 * @param Username
 * @param MovieID
 * @returns user object
 * @requires passport
 */
app.post('/users/:username/movies/:movieID', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndUpdate({
      username: req.params.username
    }, {
      $push: {
        favoriteMovies: req.params.movieID
      }
    }, {
      new: true
    },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// DELETE requests
// DELETE user by username
/**
 * DELETE a user by username
 * Request body: Bearer token
 * @name deleteUser
 * @kind function
 * @param Username
 * @returns Success message
 * @requires passport
 */
app.delete('/users/:username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndRemove({
      username: req.params.username
    })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' account has been deleted!');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// DELETE favorite movie for a user
/**
 * DELETE a movie from a user's list of favorites
 * Request body: Bearer token
 * @name deleteFavorite
 * @kind function
 * @param Username
 * @param MovieID
 * @returns user object
 * @requires passport
 */
app.delete('/users/:username/movies/:movieID', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndUpdate({
      username: req.params.username
    }, {
      $pull: {
        favoriteMovies: req.params.movieID
      }
    }, {
      new: true
    },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

app.use('/documentation', express.static('public'));

/**
 * Error handler
 * @name errorHandler
 * @kind function
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
