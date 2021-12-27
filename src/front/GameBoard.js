import { EventEmitter } from "eventemitter3";

const defaultConfig = {
  numberOfWinningSpaces: 1,
  numberOfHoles: 0
};

const maxNumberOfWinningSpaces = 3;
const maxNumberOfHoles = 3;


class GameBoard extends PIXI.Container {
  #container;
  #playerPosition;
  #winningSpaces = [];
  #holes = [];
  #eventEmitter = new EventEmitter();

  static #PADDING = 5;
  static #PLAYER_PADDING = GameBoard.#PADDING + 10;
  static #MAX_ROWS = 4;
  static #MAX_COLS = 4;
  static #BLOCK_TOTAL_SIZE = 120;

  constructor(config = defaultConfig) {
    super();

    const finalConfig = {
      ...defaultConfig,
      ...config
    };

    this.#container = new PIXI.Graphics();
    this.addChild(this.#container);

    this.setLevel(finalConfig);
  }

  setLevel(levelConfig) {
    // TODO check that holes don't block winning spaces
    this.#winningSpaces = [];
    this.#holes = [];
    this.#playerPosition = GameBoard.#generateRandomPosition();

    for (let i = 0; i < levelConfig.numberOfWinningSpaces && i < maxNumberOfWinningSpaces; i++) {
      this.#winningSpaces = this.#winningSpaces.concat(GameBoard.#generateRandomPosition([...this.#winningSpaces, ...this.#holes, this.#playerPosition]))
    }

    for (let i = 0; i < levelConfig.numberOfHoles && i < maxNumberOfHoles; i++) {
      this.#holes = this.#holes.concat(GameBoard.#generateRandomPosition([...this.#winningSpaces, ...this.#holes, this.#playerPosition]));
    }
  }

  static #getRandomInt(maxValue) {
    return Math.floor(Math.random() * maxValue);
  }

  static #generateRandomPosition(notIn = []) {

    let position = {};
    do {
      position = { col: GameBoard.#generateRandomCol(), row: GameBoard.#generateRandomRow() };

    } while (GameBoard.positionIsIncludedInArray(notIn, position));

    return position;
  }

  static #generateRandomCol() {
    return GameBoard.#getRandomInt(GameBoard.#MAX_COLS - 1);
  }

  static #generateRandomRow() {
    return GameBoard.#getRandomInt(GameBoard.#MAX_ROWS - 1);
  }

  static positionIsIncludedInArray(arrayOfPositions, positionToSearch) {
    return arrayOfPositions.findIndex(el => el.col === positionToSearch.col && el.row === positionToSearch.row) !== -1;
  }

  render(renderer) {
    super.render(renderer);
    this.#container.clear();

    for (let rowIndex = 0; rowIndex < GameBoard.#MAX_ROWS; rowIndex ++) {
      for (let colIndex = 0; colIndex < GameBoard.#MAX_COLS; colIndex++) {
        this.#container.beginFill(0xff0000);
    
        if (this.#holes.findIndex(el => el.col === colIndex && el.row === rowIndex) !== -1) {
          this.#container.beginFill(0x000000);
        }
    
        if (this.#winningSpaces.findIndex(el => el.col === colIndex && el.row === rowIndex) !== -1) {
          this.#container.beginFill(0xffffff);
        }
    
        this.#container.drawRect(
          GameBoard.#PADDING + GameBoard.#BLOCK_TOTAL_SIZE * colIndex,
          GameBoard.#PADDING + GameBoard.#BLOCK_TOTAL_SIZE * rowIndex,
          GameBoard.#BLOCK_TOTAL_SIZE - GameBoard.#PADDING * 2,
          GameBoard.#BLOCK_TOTAL_SIZE - GameBoard.#PADDING * 2
        );
      }
    }

    this.#container.beginFill(0x4fd845);
    this.#container.drawRect(
      GameBoard.#PLAYER_PADDING + GameBoard.#BLOCK_TOTAL_SIZE * this.#playerPosition.col,
      GameBoard.#PLAYER_PADDING + GameBoard.#BLOCK_TOTAL_SIZE * this.#playerPosition.row,
      GameBoard.#BLOCK_TOTAL_SIZE - GameBoard.#PLAYER_PADDING * 2,
      GameBoard.#BLOCK_TOTAL_SIZE - GameBoard.#PLAYER_PADDING * 2
    );

    this.#container.endFill();
  }

  #checkIsWin() {
    return this.#winningSpaces.findIndex(el => el.col === this.#playerPosition.col && el.row === this.#playerPosition.row) !== -1;
  }

  #isHole(position) {
    return this.#holes.findIndex(el => el.col === position.col && el.row === position.row) !== -1;
  }

  #canMoveToPosition(nextPosition) {
    return nextPosition.col >= 0 &&
          nextPosition.col < GameBoard.#MAX_COLS &&
          nextPosition.row >= 0 &&
          nextPosition.row < GameBoard.#MAX_ROWS &&
          !this.#isHole(nextPosition);
  }

  #move(colAmount = 0, rowAmount = 0) {

    if (this.#checkIsWin()) {
      return;
    }

    const nextPosition = {
      col: this.#playerPosition.col + colAmount,
      row: this.#playerPosition.row + rowAmount
    }

    if (this.#canMoveToPosition(nextPosition)) {
      this.#playerPosition = nextPosition;

      if (this.#checkIsWin()) {
        this.#eventEmitter.emit('win');
      }
    }
  }

  moveLeft() {
    this.#move(-1);
  }

  moveRight() {
    this.#move(1);
  }

  moveUp() {
    this.#move(0, -1);
  }

  moveDown() {
    this.#move(0, 1);
  }

  onwin(cb) {
    this.#eventEmitter.on('win', cb);
  }
}

export default GameBoard;
