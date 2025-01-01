const { findWords } = require("../find_words");

describe("findWords", () => {
  test("Given example", () => {
    const grid = [
      ["C", "C", "C"],
      ["C", "A", "A"],
      ["C", "C", "T"],
      ["D", "O", "G"],
    ];
    const dictionary = ["CAT", "DOG", "BIRD", "PLANE"];
    const expected = new Set(["CAT", "DOG"]);
    expect(findWords(grid, new Set(dictionary))).toEqual(expected);
  });
  test("Horizontal words", () => {
    const grid = [
      ["C", "A", "T"],
      ["X", "X", "X"],
      ["X", "X", "X"],
    ];
    const dictionary = ["CAT"];
    const expected = new Set(["CAT"]);
    expect(findWords(grid, new Set(dictionary))).toEqual(expected);
  });

  test("Vertical words", () => {
    const grid = [
      ["C", "X", "X"],
      ["A", "X", "X"],
      ["T", "X", "X"],
    ];
    const dictionary = ["CAT"];
    const expected = new Set(["CAT"]);
    expect(findWords(grid, new Set(dictionary))).toEqual(expected);
  });

  test("Diagonal words", () => {
    const grid = [
      ["C", "X", "X"],
      ["X", "A", "X"],
      ["X", "X", "T"],
    ];
    const dictionary = ["CAT"];
    const expected = new Set(["CAT"]);
    expect(findWords(grid, new Set(dictionary))).toEqual(expected);
  });

  test("Backwards word", () => {
    const grid = [
      ["T", "A", "C"],
      ["X", "X", "X"],
      ["X", "X", "X"],
    ];
    const dictionary = ["CAT"];
    const expected = new Set(["CAT"]);
    expect(findWords(grid, new Set(dictionary))).toEqual(expected);
  });

  test("Empty grid", () => {
    const grid = [];
    const dictionary = ["CAT", "DOG"];
    const expected = new Set();
    expect(findWords(grid, new Set(dictionary))).toEqual(expected);
  });

  test("Empty dictionary", () => {
    const grid = [
      ["C", "A", "T"],
      ["D", "O", "G"],
      ["P", "L", "A"],
    ];
    const dictionary = [];
    const expected = new Set();
    expect(findWords(grid, new Set(dictionary))).toEqual(expected);
  });

  test("Single letter grid", () => {
    const grid = [["C"]];
    const dictionary = ["C", "A"];
    const expected = new Set(["C"]);
    expect(findWords(grid, new Set(dictionary))).toEqual(expected);
  });

  test("Larger grid", () => {
    const grid = [
      ["C", "A", "T", "S"],
      ["D", "O", "G", "X"],
      ["P", "L", "A", "N"],
      ["X", "E", "T", "S"],
    ];
    const dictionary = ["CAT", "DOG", "PLAN", "SETS"];
    const expected = new Set(["CAT", "DOG", "PLAN"]);
    expect(findWords(grid, new Set(dictionary))).toEqual(expected);
  });
});