const { findWords } = require("../find_words");

describe("findWords", () => {
  describe("Invalid inputs", () => {
    test("wordGrid not an array", () => {
      const grid = "Invalid";
      const dictionary = new Set([]);
      expect(() => {
        findWords(grid, dictionary);
      }).toThrow(
        new Error("Invalid input: wordGrid must be an array of arrays.")
      );
    });
    test("wordGrid holding non strings", () => {
      const grid = [
        [1, "C", "C"],
        ["C", "A", "A"],
        ["C", "C", "T"],
        ["D", "O", "G"],
      ];
      const dictionary = new Set([]);
      expect(() => {
        findWords(grid, dictionary);
      }).toThrow(
        new Error(
          "Invalid input: wordGrid must contain only single-character strings."
        )
      );
    });
    test("wordGrid holding multicharacter strings", () => {
      const grid = [
        ["AB", "C", "C"],
        ["C", "A", "A"],
        ["C", "C", "T"],
        ["D", "O", "G"],
      ];
      const dictionary = new Set([]);
      expect(() => {
        findWords(grid, dictionary);
      }).toThrow(
        new Error(
          "Invalid input: wordGrid must contain only single-character strings."
        )
      );
    });
    test("dictionary not a set", () => {
      const grid = [
        ["C", "C", "C"],
        ["C", "A", "A"],
        ["C", "C", "T"],
        ["D", "O", "G"],
      ];
      const dictionary = [];
      expect(() => {
        findWords(grid, dictionary);
      }).toThrow(new Error("Invalid input: dictionary must be a Set."));
    });
  });
  describe("Valid inputs", () => {
    test("Given example", () => {
      const grid = [
        ["C", "C", "C"],
        ["C", "A", "A"],
        ["C", "C", "T"],
        ["D", "O", "G"],
      ];
      const dictionary = new Set(["CAT", "DOG", "BIRD", "PLANE"]);
      const expected = new Set(["CAT", "DOG"]);
      expect(findWords(grid, dictionary)).toEqual(expected);
    });
    test("Horizontal words", () => {
      const grid = [
        ["C", "A", "T"],
        ["X", "X", "X"],
        ["X", "X", "X"],
      ];
      const dictionary = new Set(["CAT"]);
      const expected = new Set(["CAT"]);
      expect(findWords(grid, dictionary)).toEqual(expected);
    });

    test("Vertical words", () => {
      const grid = [
        ["C", "X", "X"],
        ["A", "X", "X"],
        ["T", "X", "X"],
      ];
      const dictionary = new Set(["CAT"]);
      const expected = new Set(["CAT"]);
      expect(findWords(grid, dictionary)).toEqual(expected);
    });

    test("Diagonal words", () => {
      const grid = [
        ["C", "X", "X"],
        ["X", "A", "X"],
        ["X", "X", "T"],
      ];
      const dictionary = new Set(["CAT"]);
      const expected = new Set(["CAT"]);
      expect(findWords(grid, dictionary)).toEqual(expected);
    });

    test("Backwards word", () => {
      const grid = [
        ["T", "A", "C"],
        ["X", "X", "X"],
        ["X", "X", "X"],
      ];
      const dictionary = new Set(["CAT"]);
      const expected = new Set(["CAT"]);
      expect(findWords(grid, dictionary)).toEqual(expected);
    });

    test("Empty grid", () => {
      const grid = [];
      const dictionary = new Set(["CAT", "DOG"]);
      const expected = new Set();
      expect(findWords(grid, dictionary)).toEqual(expected);
    });

    test("Empty dictionary", () => {
      const grid = [
        ["C", "A", "T"],
        ["D", "O", "G"],
        ["P", "L", "A"],
      ];
      const dictionary = new Set([]);
      const expected = new Set();
      expect(findWords(grid, dictionary)).toEqual(expected);
    });

    test("Single letter grid", () => {
      const grid = [["C"]];
      const dictionary = new Set(["C", "A"]);
      const expected = new Set(["C"]);
      expect(findWords(grid, dictionary)).toEqual(expected);
    });

    test("Larger grid", () => {
      const grid = [
        ["C", "A", "T", "S"],
        ["D", "O", "G", "X"],
        ["P", "L", "A", "N"],
        ["X", "E", "T", "S"],
      ];
      const dictionary = new Set(["CAT", "DOG", "PLAN", "SETS"]);
      const expected = new Set(["CAT", "DOG", "PLAN"]);
      expect(findWords(grid, dictionary)).toEqual(expected);
    });

    test("Word with same prefix in dictionary", () => {
      const grid = [
        ["C", "A", "T", "S"],
        ["X", "X", "X", "X"],
        ["X", "X", "X", "X"],
        ["X", "X", "X", "X"],
      ];
      const dictionary = new Set(["CAT", "CATS"]);
      const expected = new Set(["CAT", "CATS"]);
      expect(findWords(grid, dictionary)).toEqual(expected);
    });
  });
});
