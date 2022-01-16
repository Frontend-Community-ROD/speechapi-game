const createLevelConfigObject = (numberOfWinningSpaces, numberOfHoles, maxNumberOfRows, maxNumberOfCols) => ({
  numberOfWinningSpaces,
  numberOfHoles,
  maxNumberOfRows,
  maxNumberOfCols
});
export default {
  1: createLevelConfigObject(3, 0, 4, 4),
  2: createLevelConfigObject(3, 0, 4, 4),
  3: createLevelConfigObject(3, 1, 4, 4),
  4: createLevelConfigObject(3, 1, 4, 4),
  5: createLevelConfigObject(2, 1, 4, 4),
  6: createLevelConfigObject(2, 1, 4, 4),
  7: createLevelConfigObject(2, 2, 4, 4),
  8: createLevelConfigObject(2, 2, 4, 4),
  9: createLevelConfigObject(1, 2, 4, 4),
  10: createLevelConfigObject(1, 2, 4, 4),
  11: createLevelConfigObject(1, 3, 4, 4),
  12: createLevelConfigObject(1, 3, 4, 4),
  13: createLevelConfigObject(1, 3, 4, 4),
  14: createLevelConfigObject(1, 3, 4, 4),
  15: createLevelConfigObject(1, 3, 4, 4),
}
