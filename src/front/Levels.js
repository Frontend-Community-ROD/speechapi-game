const createLevel = (numberOfWinningSpaces, numberOfHoles) => ({
  numberOfWinningSpaces,
  numberOfHoles
});
export default {
  1: createLevel(3, 0),
  2: createLevel(3, 0),
  3: createLevel(3, 1),
  4: createLevel(3, 1),
  5: createLevel(2, 1),
  6: createLevel(2, 1),
  7: createLevel(2, 2),
  8: createLevel(2, 2),
  9: createLevel(1, 2),
  10: createLevel(1, 2),
  11: createLevel(1, 3),
  12: createLevel(1, 3),
  13: createLevel(1, 3),
  14: createLevel(1, 3),
  15: createLevel(1, 3),
}
