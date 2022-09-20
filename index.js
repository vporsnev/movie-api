const express = require('express');
const dotenv = require("dotenv");

dotenv.config();
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path'),
  uuid = require('uuid');

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
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:50056'];

app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.use(morgan('combined')); // setup the logger, Mildware function to the terminal

app.use(express.static('public')); // Automatically routes all requests for static files to their corresponding files within a certain folder on the server
// support parsing of application/json type post data
// app.use(methodOverride());

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie app!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {
    root: __dirname
  });
});

app.get('/movies', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
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

app.get('/movies/actors/:actorName', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.findOne({
      'actors.name': req.params.actorName
    })
    .then((movie) => {
      res.json(movie.actor)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/actors/all/:name', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.find({
      'actor.name': req.params.name
    })
    .then((movie) => {
      res.json(movie)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

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


app.put('/movies/:title', (req, res) => {
  Movies.findOneAndUpdate({
      title: req.params.title
    }, {
      $set: {
        title: req.body.title,
        year: req.body.year,
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

app.put('/movies/:title/actors', (req, res) => {
  Movies.findOneAndUpdate({
      title: req.params.title
    }, {
      $set: [{
        name: req.body.name,
        bio: req.body.bio,
        birth: req.body.birth,
      }]
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

app.put('/users/:username/movies/:movieID', passport.authenticate('jwt', {
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
