const express = require('express'),
      morgan = require('morgan'),
      fs = require('fs'),
      path = require('path'),
      uuid = require('uuid');

const bodyParser = require('body-parser');
    // methodOverride = require('method-override');

const app = express();

app.use(morgan('combined')); // setup the logger, Mildware function to the terminal

app.use(express.static('public')); // Automatically routes all requests for static files to their corresponding files within a certain folder on the server

app.use(bodyParser.urlencoded({ //support parsing of application/x-www-form-urlencoded post data
    extended: true
}));

app.use(bodyParser.json()); // support parsing of application/json type post data
// app.use(methodOverride());

let users = [
  {
    id: 1,
    name: "Jessica",
    favoriteMovies: ["Slumdog Millionaire"]
  },
  {
    id: 2,
    name: "Vitaliy",
    favouriteMovies: ["Pulp Fiction"]
  },
]

let movies = [
  {
    title: 'The Shawshank Redemption',
    discription: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    genre: 'Drama',
    director: {
      name: 'Frank Darabont',
      bio: 'Three-time Oscar nominee Frank Darabont was born in a refugee camp in 1959 in Montbeliard, France, the son of Hungarian parents who had fled Budapest during the failed 1956 Hungarian revolution. Brought to America as an infant, he settled with his family in Los Angeles and attended Hollywood High School. His first job in movies was as a production assistant on the 1981 low-budget film, Hell Night (1981), starring Linda Blair. He spent the next six years working in the art department as a set dresser and in set construction while struggling to establish himself as a writer. His first produced writing credit (shared) was on the 1987 film, A Nightmare on Elm Street 3: Dream Warriors (1987), directed by Chuck Russell. Darabont is one of only six filmmakers in history with the unique distinction of having his first two feature films receive nominations for the Best Picture Academy Award: 1994\'s The Shawshank Redemption (1994) (with a total of seven nominations) and 1999\'s The Green Mile (1999) (four nominations). Darabont himself collected Oscar nominations for Best Adapted Screenplay for each film (both based on works by Stephen King), as well as nominations for both films from the Director\'s Guild of America, and a nomination from the Writers Guild of America for The Shawshank Redemption (1994). He won the Humanitas Prize, the PEN Center USA West Award, and the Scriptor Award for his screenplay of The Shawshank Redemption. For The Green Mile, he won the Broadcast Film Critics prize for his screenplay adaptation, and two People\'s Choice Awards in the Best Dramatic Film and Best Picture categories. The Majestic (2001), starring Jim Carrey, was released in December 2001. He executive-produced the thriller, Collateral (2004), for DreamWorks, with Michael Mann directing and Tom Cruise starring. Future produced-by projects include Way of the Rat at DreamWorks with Chuck Russell adapting and directing the CrossGen comic book series and Back Roads, a Tawni O\'Dell novel, also at DreamWorks, with Todd Field attached to direct. Darabont and his production company, Darkwoods Productions, have an overall deal with Paramount Pictures.',
    },
    imageURL: 'https://fffmovieposters.com/wp-content/uploads/69576.jpg',
    featured: false
  },
  {
    title: 'Pulp Fiction',
    discription: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    genre: 'Crime',
    director: {
      name: 'Quentin Tarantino',
      bio: 'Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee. Quentin moved with his mother to Torrance, California, when he was four years old. In January of 1992, first-time writer-director Tarantino\'s Reservoir Dogs (1992) appeared at the Sundance Film Festival. The film garnered critical acclaim and the director became a legend immediately. Two years later, he followed up Dogs success with Pulp Fiction (1994) which premiered at the Cannes film festival, winning the coveted Palme D Or Award. At the 1995 Academy Awards, it was nominated for the best picture, best director and best original screenplay. Tarantino and writing partner Roger Avary came away with the award only for best original screenplay. In 1995, Tarantino directed one fourth of the anthology Four Rooms (1995) with friends and fellow auteurs Alexandre Rockwell, Robert Rodriguez and Allison Anders. The film opened December 25 in the United States to very weak reviews. Tarantino\'s next film was From Dusk Till Dawn (1996), a vampire/crime story which he wrote and co-starred with George Clooney. The film did fairly well theatrically. Since then, Tarantino has helmed several critically and financially successful films, including Jackie Brown (1997), Kill Bill: Vol. 1 (2003), Kill Bill: Vol. 2 (2004), Inglourious Basterds (2009), Django Unchained (2012) and The Hateful Eight (2015).',
    },
    imageURL: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg',
    featured: false
  },
  {
    title: 'Forrest Gump',
    discription: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.',
    genre: 'Drama',
    director: {
      name: 'Robert Zemeckis',
      bio: 'A whiz-kid with special effects, Robert is from the Spielberg camp of film-making (Steven Spielberg produced many of his films). Usually working with writing partner Bob Gale, Robert\'s earlier films show he has a talent for zany comedy (Romancing the Stone (1984), 1941 (1979)) and special effect vehicles (Who Framed Roger Rabbit (1988) and Back to the Future (1985)). His later films have become more serious, with the hugely successful Tom Hanks vehicle Forrest Gump (1994) and the Jodie Foster film Contact (1997), both critically acclaimed movies. Again, these films incorporate stunning effects. Robert has proved he can work a serious story around great effects.',
    },
    imageURL: 'https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg',
    featured: false
  },
  {
    title: 'Fight Club',
    discription: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
    genre: 'Drama',
    director: {
      name: 'David Fincher',
      bio: 'David Fincher was born in 1962 in Denver, Colorado, and was raised in Marin County, California. When he was 18 years old he went to work for John Korty at Korty Films in Mill Valley. He subsequently worked at ILM (Industrial Light and Magic) from 1981-1983. Fincher left ILM to direct TV commercials and music videos after signing with N. Lee Lacy in Hollywood. He went on to found Propaganda in 1987 with fellow directors Dominic Sena, Greg Gold and Nigel Dick. Fincher has directed TV commercials for clients that include Nike, Coca-Cola, Budweiser, Heineken, Pepsi, Levi\'s, Converse, AT&T and Chanel. He has directed music videos for Madonna, Sting, The Rolling Stones, Michael Jackson, Aerosmith, George Michael, Iggy Pop, The Wallflowers, Billy Idol, Steve Winwood, The Motels and, most recently, A Perfect Circle. As a film director, he has achieved huge success with Se7en (1995), Fight Club (1999) and, Panic Room (2002).',
    },
    imageURL: 'https://m.media-amazon.com/images/I/51OsUdPrjoL._AC_.jpg',
    featured: false
  },
  {
    title: 'One Flew Over the Cuckoo\'s Nest',
    discription: 'A criminal pleads insanity and is admitted to a mental institution, where he rebels against the oppressive nurse and rallies up the scared patients.',
    genre: 'Drama',
    director: {
      name: 'Milos Forman',
      bio: 'Milos Forman was born Jan Tomas Forman in Caslav, Czechoslovakia, to Anna (Svabova), who ran a summer hotel, and Rudolf Forman, a professor. During World War II, his parents were taken away by the Nazis, after being accused of participating in the underground resistance. His father died in Buchenwald and his mother died in Auschwitz, and Milos became an orphan very early on. He studied screen-writing at the Prague Film Academy (F.A.M.U.). In his Czechoslovakian films, Cerný Petr (1964), Lásky jedné plavovlásky (1965), and Horí, má panenko (1967), he created his own style of comedy. During the invasion of his country by the troops of the Warsaw pact in the summer of 1968 to stop the Prague spring, he left Europe for the United States. In spite of difficulties, he filmed Taking Off (1971) there and achieved his fame later with One Flew Over the Cuckoo\'s Nest (1975) adapted from the novel of Ken Kesey, which won five Oscars including one for direction. Other important films of Milos Forman were the musical Hair (1979) and his biography of Wolfgang Amadeus Mozart, Amadeus (1984), which won eight Oscars.',
    },
    imageURL: 'https://m.media-amazon.com/images/I/41DthCZaAPL._AC_.jpg',
    featured: false
  },
  {
    title: 'Se7ev',
    discription: 'Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.',
    genre: 'Crime',
    director: {
      name: 'David Fincher',
      bio: 'David Fincher was born in 1962 in Denver, Colorado, and was raised in Marin County, California. When he was 18 years old he went to work for John Korty at Korty Films in Mill Valley. He subsequently worked at ILM (Industrial Light and Magic) from 1981-1983. Fincher left ILM to direct TV commercials and music videos after signing with N. Lee Lacy in Hollywood. He went on to found Propaganda in 1987 with fellow directors Dominic Sena, Greg Gold and Nigel Dick. Fincher has directed TV commercials for clients that include Nike, Coca-Cola, Budweiser, Heineken, Pepsi, Levi\'s, Converse, AT&T and Chanel. He has directed music videos for Madonna, Sting, The Rolling Stones, Michael Jackson, Aerosmith, George Michael, Iggy Pop, The Wallflowers, Billy Idol, Steve Winwood, The Motels and, most recently, A Perfect Circle. As a film director, he has achieved huge success with Se7en (1995), Fight Club (1999) and, Panic Room (2002).',
    },
    imageURL: 'https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMi00OTk4LTg3NWUtNmVhMTAzNTNjYjcyXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    featured: false
  },
  {
    title: 'The Green Mile',
    discription: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.',
    genre: 'Drama',
    director: {
      name: 'Frank Darabont',
      bio: 'Three-time Oscar nominee Frank Darabont was born in a refugee camp in 1959 in Montbeliard, France, the son of Hungarian parents who had fled Budapest during the failed 1956 Hungarian revolution. Brought to America as an infant, he settled with his family in Los Angeles and attended Hollywood High School. His first job in movies was as a production assistant on the 1981 low-budget film, Hell Night (1981), starring Linda Blair. He spent the next six years working in the art department as a set dresser and in set construction while struggling to establish himself as a writer. His first produced writing credit (shared) was on the 1987 film, A Nightmare on Elm Street 3: Dream Warriors (1987), directed by Chuck Russell. Darabont is one of only six filmmakers in history with the unique distinction of having his first two feature films receive nominations for the Best Picture Academy Award: 1994\'s The Shawshank Redemption (1994) (with a total of seven nominations) and 1999\'s The Green Mile (1999) (four nominations). Darabont himself collected Oscar nominations for Best Adapted Screenplay for each film (both based on works by Stephen King), as well as nominations for both films from the Director\'s Guild of America, and a nomination from the Writers Guild of America for The Shawshank Redemption (1994). He won the Humanitas Prize, the PEN Center USA West Award, and the Scriptor Award for his screenplay of The Shawshank Redemption. For The Green Mile, he won the Broadcast Film Critics prize for his screenplay adaptation, and two People\'s Choice Awards in the Best Dramatic Film and Best Picture categories. The Majestic (2001), starring Jim Carrey, was released in December 2001. He executive-produced the thriller, Collateral (2004), for DreamWorks, with Michael Mann directing and Tom Cruise starring. Future produced-by projects include Way of the Rat at DreamWorks with Chuck Russell adapting and directing the CrossGen comic book series and Back Roads, a Tawni O\'Dell novel, also at DreamWorks, with Todd Field attached to direct. Darabont and his production company, Darkwoods Productions, have an overall deal with Paramount Pictures.',
    },
    imageURL: 'https://m.media-amazon.com/images/I/51p4M9-VzPL._AC_.jpg',
    featured: false
  },
  {
    title: 'Back to the Future',
    discription: 'Marty McFly, a 17-year-old high school student, is accidentally sent thirty years into the past in a time-traveling DeLorean invented by his close friend, the eccentric scientist Doc Brown.',
    genre: 'Adventure',
    director: {
      name: 'Robert Zemeckis',
      bio: 'A whiz-kid with special effects, Robert is from the Spielberg camp of film-making (Steven Spielberg produced many of his films). Usually working with writing partner Bob Gale, Robert\'s earlier films show he has a talent for zany comedy (Romancing the Stone (1984), 1941 (1979)) and special effect vehicles (Who Framed Roger Rabbit (1988) and Back to the Future (1985)). His later films have become more serious, with the hugely successful Tom Hanks vehicle Forrest Gump (1994) and the Jodie Foster film Contact (1997), both critically acclaimed movies. Again, these films incorporate stunning effects. Robert has proved he can work a serious story around great effects.',
    },
    imageURL: 'https://static.posters.cz/image/750/poster/back-to-the-future-i2795.jpg',
    featured: false
  },
  {
    title: 'Intouchables',
    discription: 'After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.',
    genre: 'Drama',
    director: {
      name: 'Olivier Nakache',
      bio: 'Olivier Nakache was born on April 15, 1973 in Suresnes, Hauts-de-Seine, France. He is a writer and producer, known for Intouchables (2011), Le sens de la fête (2017) and Hors normes (2019).',
    },
    imageURL: 'https://i.ebayimg.com/images/g/NDEAAOSwKfVXLviD/s-l500.jpg',
    featured: false
  },
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie app!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.post('/users', (req, res) => {
    const newUser = req.body

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('users need names')
    }
})

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updateUser = req.body; // is posible just for this code: "app.use(bodyParser.json())". is what enables us to read data from the body object

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updateUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }
})

app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
})

app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle)
        res.status(200).send(`${movieTitle} has been deleted from user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
})

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id != id)
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send('no such user')
    }
})

app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
})

app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.genre === genreName).genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }
})

app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.director.name === directorName).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
})

app.use('/documentation', express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
