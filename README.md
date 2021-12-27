# SpeechGame

This is a game that uses the SpeechAPI from browsers. You have to check if the browsers supports the API when trying the game.

## Requirements

- NodeJS >= 14.18.1
- A browser compatible with the SpeechAPI


## Installation

- Clone this repository.
- Install dependencies with `npm install`
- Run the game with `npm run`
- Open the game in your browser in `https://localhost:3000`

Pay attention in the URL of the game, it is `https` and not `http`. The command `npm run` will create a secure server in your local machine and deploy the game inside of that server. Every change will make the code to be compiled and deployed again.

Certificates of the secure server are located int the `cert` folder.

## Play the game

### Objects
- Red square: square where the player can land.
- Black square: square where the player CANNOT land. Like a wall.
- White square: square wich the player has to reach to win the game.
- Green smaller square: player.

### Commands

The game is played your voice. The first time you play the game, the browser will ask you for permission in using your microphone. This commands will be recognized by the game:

- izquierda: move the player to the left.
- derecha: move tha player to the right.
- arriba: move the player up.
- abajo: move the player down.


## TODO
- Add a countdown timer per level. When the timer reachs to 0 (zero), the player loses the level.
- Add a menu.
- Add some UI to the level screen.
- Give feedback to the player when a level is completed.
- Give feedback to the player when he/she loses.
- Show a transicion when the player is moving.
