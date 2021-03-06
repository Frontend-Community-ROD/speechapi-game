import { EventEmitter } from "eventemitter3";

const defaultLevelConfig = {
  numberOfWinningSpaces: 1,
  numberOfHoles: 0,
  maxNumberOfCols: 4,
  maxNumberOfRows: 4
};

const maxNumberOfWinningSpaces = 3;
const maxNumberOfHoles = 3;


class GameBoard extends PIXI.Container {
  #container;
  #playerPosition;
  #winningSpaces = [];
  #holes = [];
  #eventEmitter = new EventEmitter();
  #levelConfig = defaultLevelConfig;

  /**
   * @private
   * @description current game board size
   */
  #gameBoardSize;
  #blockWidth;
  #blockHeight;

  static #PADDING = 5;
  static #PLAYER_PADDING = GameBoard.#PADDING + 10;
  static #DEFAULT_MAX_ROWS = defaultLevelConfig.maxNumberOfRows;
  static #DEFAULT_MAX_COLS = defaultLevelConfig.maxNumberOfCols;

  /**
   * @description Creates a new GameBoard.
   * 
   * @param {object} canvasSize size of the canvas where the gameboard is going to be rendered.
   * @param {number} size.width total width of the canvas.
   * @param {number} size.height total height of the canvas.
   * @param {object} [initialLevelConfig=defaultLevelConfig] initial level configuration.
   * @param {number} [numberOfWinningSpaces=defaultLevelConfig.numberOfWinningSpaces] number of winning spaces
   * to be displayed.
   * @param {number} [numberOfHoles=defaultLevelConfig.numberOfHoles] number of holes to be displayed.
   * @param {number} [maxNumberOfCols=defaultLevelConfig.maxNumberOfCols] maximum number of columns to be displayed.
   * @param {number} [maxNumberOfRows=defaultLevelConfig.maxNumberOfRows] maximum number of rows to be displayed.
   */
  constructor(canvasSize, initialLevelConfig = defaultLevelConfig) {
    super();

    this.#gameBoardSize = canvasSize;
    const finalLevelConfig = {
      ...defaultLevelConfig,
      ...initialLevelConfig
    };

    this.#container = new PIXI.Graphics();
    this.addChild(this.#container);

    this.setLevel(finalLevelConfig);
  }

  /**
   * Set level configuration.
   * 
   * @param {object} levelConfig level configuration.
   * @param {number} levelConfig.numberOfWinningSpaces number of winning spaces.
   * @param {number} levelConfig.numberOfHoles number of holes.
   * @param {number} levelConfig.maxNumberOfCols maximum number of columns to use.
   * @param {number} levelConfig.maxNumberOfRows maximum number of rows to use.
   */
  setLevel(levelConfig) {
    // TODO check that holes don't block winning spaces
    this.#blockWidth = this.#gameBoardSize.width / levelConfig.maxNumberOfCols;
    this.#blockHeight = this.#gameBoardSize.height / levelConfig.maxNumberOfRows;
    this.#levelConfig = levelConfig;
    this.#winningSpaces = [];
    this.#holes = [];
    this.#playerPosition = GameBoard.#generateRandomPosition([], levelConfig);
    
    for (let i = 0; i < levelConfig.numberOfWinningSpaces && i < maxNumberOfWinningSpaces; i++) {
      this.#winningSpaces = this.#winningSpaces.concat(GameBoard.#generateRandomPosition([...this.#winningSpaces, ...this.#holes, this.#playerPosition], levelConfig))
    }
    
    for (let i = 0; i < levelConfig.numberOfHoles && i < maxNumberOfHoles; i++) {
      this.#holes = this.#holes.concat(GameBoard.#generateRandomPosition([...this.#winningSpaces, ...this.#holes, this.#playerPosition], levelConfig));
    }
    
    this.#eventEmitter.emit('levelConfig', levelConfig);
  }

  /**
   * Gets a random integer number between 0 and maxValue.
   * 
   * @param {number} maxValue max value of the integer
   * @returns a random integer number.
   */
  static #getRandomInt(maxValue) {
    return Math.floor(Math.random() * maxValue);
  }

  /**
   * Gets a random position.
   * 
   * @param {number[]} notIn the position does not have to be in
   * the provided positions.
   * @returns {object} a random position. Object to be returned has
   * 'row' and 'col' properties.
   */
  static #generateRandomPosition(notIn = [], levelConfig) {
    
    let position = {};
    do {
      position = { col: GameBoard.#generateRandomCol(levelConfig.maxNumberOfRows), row: GameBoard.#generateRandomRow(levelConfig.maxNumberOfCols) };

    } while (GameBoard.positionIsIncludedInArray(notIn, position));
    console.log('pos', position);
    return position;
  }

  /**
   * Generates a random column value.
   * 
   * @returns {number} the column value.
   */
  static #generateRandomCol(maxNumberOfCols = GameBoard.#DEFAULT_MAX_COLS) {
    return GameBoard.#getRandomInt(maxNumberOfCols - 1);
  }

  /**
   * Generates a random row value.
   * 
   * @returns {number} the row value.
   */
  static #generateRandomRow(maxNumberOfRows = GameBoard.#DEFAULT_MAX_ROWS) {
    return GameBoard.#getRandomInt(maxNumberOfRows - 1);
  }

  /**
   * Verifies if the position is included in any of the positions arrays.
   * 
   * @param {object[]} arrayOfPositions arrays of position where to check.
   * @param {object} positionToSearch position to check if exists in the array of positions.
   * @param {number} positionToSearch.row row of the position.
   * @param {number} positionToSearch.col column of the position.
   * @returns true if the position is included in any of the array of positions, false
   * otherwise.
   */
  static positionIsIncludedInArray(arrayOfPositions, positionToSearch) {
    return arrayOfPositions.findIndex(el => el.col === positionToSearch.col && el.row === positionToSearch.row) !== -1;
  }

  render(renderer) {
    super.render(renderer);
    this.#container.clear();

    // We draw game board squares: available positions, holes and winning spaces
    for (let rowIndex = 0; rowIndex < this.#levelConfig.maxNumberOfRows; rowIndex ++) {
      for (let colIndex = 0; colIndex < this.#levelConfig.maxNumberOfCols; colIndex++) {

        // default color: available space
        this.#container.beginFill(0xff0000);
    
        // if the current position is a hole, draw a black square
        if (this.#holes.findIndex(el => el.col === colIndex && el.row === rowIndex) !== -1) {
          this.#container.beginFill(0x000000);
        }
    
        // if the current position is a winning position, draw a white square
        if (this.#winningSpaces.findIndex(el => el.col === colIndex && el.row === rowIndex) !== -1) {
          this.#container.beginFill(0xffffff);
        }
    
        // draw the rectangle
        this.#container.drawRect(
          GameBoard.#PADDING + this.#blockWidth * colIndex,
          GameBoard.#PADDING + this.#blockHeight * rowIndex,
          this.#blockWidth - GameBoard.#PADDING * 2,
          this.#blockHeight - GameBoard.#PADDING * 2
        );
      }
    }

    // draw the player
    this.#container.beginFill(0x4fd845);
    this.#container.drawRect(
      GameBoard.#PLAYER_PADDING + this.#blockWidth * this.#playerPosition.col,
      GameBoard.#PLAYER_PADDING + this.#blockHeight * this.#playerPosition.row,
      this.#blockWidth - GameBoard.#PLAYER_PADDING * 2,
      this.#blockHeight - GameBoard.#PLAYER_PADDING * 2
    );

    this.#container.endFill();
  }

  /**
   * Verifies if the player won the game.
   * 
   * @returns true if the player reached a winning space, false otherwise.
   */
  #checkIsWin() {
    return this.#winningSpaces.findIndex(el => el.col === this.#playerPosition.col && el.row === this.#playerPosition.row) !== -1;
  }

  /**
   * Verifies if there is a hole in the given position.
   * 
   * @param {object} position position to check for a hole.
   * @param {number} position.row row to check.
   * @param {number} position.col col to check.
   * @returns true if in the position there is a hole, false otherwise.
   */
  #isHole(position) {
    return this.#holes.findIndex(el => el.col === position.col && el.row === position.row) !== -1;
  }

  /**
   * Checks if the player can move to the given position.
   * 
   * @param {object} nextPosition position where to check.
   * @returns true if the player can move, false otherwise.
   */
  #canMoveToPosition(nextPosition) {
    return nextPosition.col >= 0 &&
          nextPosition.col < this.#levelConfig.maxNumberOfCols &&
          nextPosition.row >= 0 &&
          nextPosition.row < this.#levelConfig.maxNumberOfRows &&
          !this.#isHole(nextPosition);
  }

  /**
   * Moves the player by the given amount.
   * 
   * @param {number} [colAmount=0] number of columns to move.
   * @param {number} [rowAmount=0] number of rows to move.
   */
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

  /**
   * Moves the player one position to the left.
   */
  moveLeft() {
    this.#move(-1);
  }

  /**
   * Moves the player one position to the right.
   */
  moveRight() {
    this.#move(1);
  }

  /**
   * Moves the player one position up.
   */
  moveUp() {
    this.#move(0, -1);
  }

  /**
   * Moves the player one position down.
   */
  moveDown() {
    this.#move(0, 1);
  }

  /**
   * Subscribe to the 'win' event.
   * 
   * @param {function} cb callback to invoke when the
   * player wins.
   */
  onwin(cb) {
    this.#eventEmitter.on('win', cb);
  }

  /**
   * Subscribe to the 'levelConfig' event. This event will be fired each
   * time the level configuration changes.
   * 
   * @param {function} cb callback to invoke when the
   * event fires.
   */
  onlevenConfigChange(cb) {
    this.#eventEmitter.on('levelConfig', cb);
  }
}

export default GameBoard;
