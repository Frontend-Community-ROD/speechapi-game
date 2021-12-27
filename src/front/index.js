import GameBoard from './GameBoard';
import Levels from './Levels';

var pixiApp = new PIXI.Application({ width: 480, height: 480 });
document.body.appendChild(pixiApp.view);

let currentLevelNumber = 1;
let currentLevelConfig = Levels['' + currentLevelNumber];

const gameBoardInstance = new GameBoard(currentLevelConfig);
gameBoardInstance.onwin(() => {
  currentLevelNumber++;
  currentLevelConfig = Levels['' + currentLevelNumber];
  gameBoardInstance.setLevel(currentLevelConfig);
});

pixiApp.stage.addChild(gameBoardInstance);



var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var controls = [ 'izquierda', 'derecha', 'arriba', 'abajo' ];
var grammar = '#JSGF V1.0; grammar controls; public <control> = ' + controls.join(' | ') + ' ;';

const speechControlsHandlers = {
  'izquierda': () => gameBoardInstance.moveLeft(),
  'derecha': () => gameBoardInstance.moveRight(),
  'abajo': () => gameBoardInstance.moveDown(),
  'arriba': () => gameBoardInstance.moveUp()
}

let recognitionStarted = false;

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'es';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.body.onclick = function() {

  if (recognitionStarted) {
    console.log('Already capturing...');
    return;
  }

  recognition.start();
  recognitionStarted = true;
  console.log('Ready to receive a commands.');
}

recognition.onstart = function() {
  console.log('Capturing started...');
}

recognition.onresult = function(event) {
  const speech = event.results[0][0].transcript;
  console.log("results", event.results);
  console.log('Confidence: ' + event.results[0][0].confidence);

  const speechControls = speech.split(' ').filter(said => controls.includes(said));
  console.log('speech', speechControls);
  speechControls.forEach(cont => speechControlsHandlers[cont]());
}

recognition.onend = function() {
  console.log('Capturing ended...');
  recognition.start();
}


