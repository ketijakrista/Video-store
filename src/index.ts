import inquirer from 'inquirer'
import { VideoStore } from './video-store';
import { Video } from './video-store';

const store = new VideoStore();
store.addMovie('Star Wars Episode IV: A New Hope', 10)
store.addMovie('The Matrix', 10)
store.addMovie('Godfather II', 10)

async function rentVideo() {
  const { choices, name } = await inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "What is your name?"
    },
    {
      name: "choices",
      type: "checkbox",
      message: "Which ones do you want?",
      choices: store.asChoices
    }
  ]);
  let isTheMovie = function (x: Video) {
    return x.name === 'Godfather II'
  }
  if (choices.some(isTheMovie)) {

    console.log(`Movies in store:\n${store.printContent}\n`);
  }
  store.rentMovies(choices, name);
  console.log(
    `Great choice, ${name}!\nYou picked: ${choices.map((c: Video) => `${c.name} `).join(", ")}\n`
  );

}

async function returnVideo() {
  let addMore = true;
  const { name } = await inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "What is your name?"
    },
  ]);

    while (addMore && store.rentedMovies(name).length > 0) {
      const { movie, movieRating, more } = await inquirer.prompt([
        {
          name: "movie",
          type: "list",
          message: "Which one would you like to return?",
          choices: store.rentedMovies(name)
        },
        {
          type: "number",
          name: "movieRating",
          message: "Enter movie rating"
        },
        {
          type: "confirm",
          name: "more",
          message: "Would you like to return more?"
        }
      ]);
      addMore = more;
      store.returnMovies(movie, movieRating);
      console.log(`You rated movie "${movie.name}" with ${movieRating} stars!`);
    }
    if(store.rentedMovies(name).length === 0) {
      console.log('You have 0 movies to return!')
    }
  }


async function fillVideoStore() {
  let addMore = true;
  while (addMore) {
    const { movieName, movieRating, more } = await inquirer.prompt([
      { type: "input", name: "movieName", message: "Enter movie name" },
      { type: "number", name: "movieRating", message: "Enter movie rating [1-10]" },
      { type: "confirm", name: "more", message: "Would you like to add more?" }
    ]);
    addMore = more;
    store.addMovie(movieName, movieRating);
    console.log(`Thanks, here is the movie list:\n${store.printContent}`);
  }
}

async function app() {
  const { user } = await inquirer.prompt([
    {
      type: "list",
      name: "user",
      message: "Welcome to our video store. Who are you?",
      choices: [
        "User",
        "Admin",
        { name: `I don't want to be here. Let me go`, value: false }
      ]
    }
  ]);
  if (user === "Admin") {
    console.log("Hello Admin. I guess you're here to fill our store.");
    await fillVideoStore();
  } else if (user === "User") {
    console.log("Hello User");
    const { intent } = await inquirer.prompt([
      {
        type: "list",
        name: "intent",
        message: "What do you want to do?",
        choices: [
          { name: "Rent a video", value: "rent" },
          { name: "Return a video", value: "return" },
          { name: "See all movies in store", value: "inventory" }
        ]
      }
    ]);
    if (intent === "rent") {
      await rentVideo()
    } else if (intent === "return") {
      await returnVideo()
    } else {
      console.log(`Here is the movie list:\n${store.printContent}`);
    }
  } else {
    return;
  }

  console.log("Okay. Thanks and Bye!");


  app();
}

app();