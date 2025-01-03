/*
 * This program should find all words from a dictionary in a grid of letters. Words
 * can be matched in any direction (horizontally, vertically, and diagonally).
 * For example, if passed the dictionary {"CAT", "DOG", "BIRD", "PLANE"}, the program
 * should return the set {"CAT", "DOG"}.
 *
 * 	    |  C  |  C  |  C  |
 *      |  C  |  A  |  C  |
 *      |  C  |  C  |  T  |
 * 		|  D  |  O  |  G  |
 *
 * Your task is to implement the main function and any other functions you may need to
 * complete the task. In addition to functionality, you'll be assessed on code efficiency,
 * overall structure/code decomposition, and error handling.
 */

/**
 * Represents a Trie Node in the Trie data structure.
 */
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

/**
 * Represents a Trie data structure used for efficient word lookups.
 */
class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  /**
   * Inserts a word into the Trie.
   * @param {string} word The word to insert into the Trie.
   */
  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }
}

/**
 * Helper function to validate the input values for wordGrid and dictionary
 * @param {Array} wordGrid Letter grid as an array of arrays of strings
 * @param {Set} dictionary Set containing words to search for
 * @returns {Set} The dictionary, ensuring all entries are valid
 * @throws {TypeError} If any input is invalid
 */
const validateInputs = (wordGrid, dictionary) => {
  if (
    !Array.isArray(wordGrid) ||
    !wordGrid.every((row) => Array.isArray(row))
  ) {
    throw new TypeError("wordGrid must be an array of arrays.");
  }

  if (
    !wordGrid.every((row) =>
      row.every((char) => typeof char === "string" && char.length === 1)
    )
  ) {
    throw new TypeError("wordGrid must contain only single-character strings.");
  }

  if (!(dictionary instanceof Set)) {
    throw new TypeError("dictionary must be a Set.");
  }

  return dictionary;
};

/**
 * Helper function to check if a given coordinate is within the grid bounds.
 * @param {number} row The row index of the grid.
 * @param {number} col The column index of the grid.
 * @param {number} numberOfRows Total number of rows in the grid.
 * @param {number} numberOfColumns Total number of columns in the grid.
 * @returns {boolean} Returns true if the coordinates are within bounds; false otherwise.
 */
const isValidCoord = (row, col, numberOfRows, numberOfColumns) => {
  return row >= 0 && col >= 0 && row < numberOfRows && col < numberOfColumns;
};

/**
 * Finds all words from the dictionary that are present in the grid of letters
 * @param {Array} wordGrid Letter grid represented as an array of char arrays.
 * The first array from the above example would be passed in
 * as ["C", "C", "C"] and the second would be ["C", "A", "C"], etc...)
 * @param {Set} dictionary Contains all words to look for in the letter grid
 * @returns {Set} All words from the dictionary that were found
 * @throws {Error} If an error is encountered
 */
function findWords(wordGrid, dictionary) {
  try {
    dictionary = validateInputs(wordGrid, dictionary);
  } catch (error) {
    throw new Error(`Invalid input: ${error.message}`);
  }

  try {
    if (wordGrid.length === 0 || dictionary.size === 0) {
      return new Set();
    }

    const numberOfRows = wordGrid.length;
    const numberOfColumns = wordGrid[0].length;
    const foundWords = new Set();
    const visited = Array.from({ length: numberOfRows }, () =>
      Array(numberOfColumns).fill(false)
    );
    const trie = new Trie();
    const directions = [
      [-1, 0], // Up
      [1, 0], // Down
      [0, -1], // Left
      [0, 1], // Right
      [-1, -1], // Up+Left
      [-1, 1], // Up+Right
      [1, -1], // Down+Left
      [1, 1], // Down+Right
    ];

    for (const word of dictionary) {
      trie.insert(word);
    }

    function directionalDfs(row, col, node, word, direction) {
      if (
        !isValidCoord(row, col, numberOfRows, numberOfColumns) ||
        visited[row][col]
      ) {
        return;
      }

      const char = wordGrid[row][col];
      if (!node.children[char]) {
        return;
      }

      visited[row][col] = true;
      word += char;
      node = node.children[char];

      if (node.isEndOfWord) {
        foundWords.add(word);
      }

      if (direction === null) {
        for (const [dx, dy] of directions) {
          directionalDfs(row + dx, col + dy, node, word, [dx, dy]);
        }
      } else {
        const [dx, dy] = direction;
        directionalDfs(row + dx, col + dy, node, word, direction);
      }

      visited[row][col] = false;
    }

    for (let row = 0; row < numberOfRows; row++) {
      for (let col = 0; col < numberOfColumns; col++) {
        const char = wordGrid[row][col];
        if (trie.root.children[char]) {
          directionalDfs(row, col, trie.root, "", null);
        }
      }
    }

    return foundWords;
  } catch (error) {
    throw new Error("An unexpected error has occurred.");
  }
}

module.exports.findWords = findWords;
