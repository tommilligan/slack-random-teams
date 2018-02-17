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
  let chunks = Array(len).fill([]);
  arr.forEach((el, i) => {
    console.log(chunks)
    chunks[i % len].push(el);
  });
  return chunks;
  }

module.exports = {
  shuffle,
  chunkArray
}
  