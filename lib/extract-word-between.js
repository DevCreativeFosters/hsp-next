export default function extractWordBetween(text, startWord, endWord) {
  const startIndex = text?.indexOf(startWord) + startWord.length;
  const endIndex = text?.indexOf(endWord, startIndex);

  return startIndex < endIndex ? text?.substring(startIndex, endIndex) : null;
}
