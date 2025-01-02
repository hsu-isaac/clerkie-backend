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

class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

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

  searchPrefix(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) return null;
      node = node.children[char];
    }
    return node;
  }

  contains(word) {
    const node = this.searchPrefix(word);
    return node !== null && node.isEndOfWord;
  }
}

/**
 * Finds all words from the dictionary that are present in the grid of letters
 * @param {Array} wordGrid Letter grid represented as an array of char arrays.
 * The first array from the above example would be passed in
 * as ["C", "C", "C"] and the second would be ["C", "A", "C"], etc...)
 * @param {Set} dictionary Contains all words to look for in the letter grid
 * @returns {Set} All words from the dictionary that were found
 */
function findWords(wordGrid, dictionary) {
  if (
    !wordGrid ||
    !dictionary ||
    wordGrid.length === 0 ||
    dictionary.size === 0
  ) {
    return new Set();
  }

  const trie = new Trie();
  for (const word of dictionary) {
    trie.insert(word);
  }

  const rows = wordGrid.length;
  const cols = wordGrid[0].length;
  const foundWords = new Set();
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

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

  function dfs(row, col, node, word, dir) {
    if (row < 0 || col < 0 || row >= rows || col >= cols || visited[row][col]) {
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

    if (dir === null) {
      for (const [dx, dy] of directions) {
        dfs(row + dx, col + dy, node, word, [dx, dy]);
      }
    } else {
      const [dx, dy] = dir;
      dfs(row + dx, col + dy, node, word, dir);
    }

    visited[row][col] = false;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const char = wordGrid[row][col];
      if (trie.root.children[char]) {
        dfs(row, col, trie.root, "", null);
      }
    }
  }

  return foundWords;
}

module.exports.findWords = findWords;
