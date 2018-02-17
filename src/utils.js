/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Splits and array into equalish length chunks
 * @param {Array} arr Array to chunk
 * @param {Integer} len Number of chunks to split into
 */
function chunkArray(arr, len) {
  // initialise an array of arrays
  // if there is a better way to do this, let me know
  let chunks = [];
  for(let i = 0; i < len; i++) {
    chunks.push([]);
  }

  // iterate through array and push elements to chunks
  arr.forEach((el, i) => {
    chunks[i % len].push(el);
  });
  return chunks;
}

module.exports = {
  shuffle,
  chunkArray
};
  