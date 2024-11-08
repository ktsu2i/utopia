export default function parseEmoji(unicode: string) {
  return String.fromCodePoint(parseInt(unicode, 16))
}