import GameBoard from './GameBoard';
import Levels from './Levels';

var pixiApp = new PIXI.Application({
	width: 480,
	height: 480
});
GameContainer.appendChild(pixiApp.view);

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
const speechControlsHandlers = {
	'izquierda': () => gameBoardInstance.moveLeft(),
	'derecha': () => gameBoardInstance.moveRight(),
	'abajo': () => gameBoardInstance.moveDown(),
	'arriba': () => gameBoardInstance.moveUp()
}

let recognitionStarted = false;
let movedPiece = false;
const confidenceThreshold = .90;

var controls = Object.keys(speechControlsHandlers);
//var grammar = '#JSGF V1.0; grammar controls; public <control> = ' + controls.join(' | ') + ' ;';

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

//speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.body.onclick = function () {

	if (recognitionStarted) {
		console.log('Already capturing...');
		return;
	} else {

		recognition.start();
		recognitionStarted = true;
		console.log('Ready to receive a commands.');
	}

}

recognition.onstart = function () {
	console.log('Capturing started...');
	movedPiece = false
}

recognition.onresult = function (event) {
	const {
		transcript,
		confidence
	} = event.results[0][0]
	console.log(transcript)
	if (confidence < confidenceThreshold) {
		recognition.end()
		return
	};
	const actionControl = transcript.split(' ').find(said => [...controls].includes(said));
	if (!!actionControl) {
		const action = speechControlsHandlers[actionControl]
		if (action) {
			action()
			movedPiece = true;
		}
	}
}

recognition.onend = function (event) {

	if (movedPiece) {
		console.log('Capturing ended...');
		recognition.start();
	}
}