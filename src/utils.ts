import type { BinaryBlob, BinaryId, Card, CardId } from "./typing"

export function newCardId() {
  return (Date.now()+Math.random()).toString(36) as CardId
}
export function newBinaryId() {
  return (Date.now()+Math.random()).toString(35).replace(/[.]/g, 'z') as BinaryId
}

export function promptAddTag(c: Card) {
  const tag = prompt('Add a new tag')
  if (tag) {
    if (!c.tags.includes(tag)) {
      c.tags.push(tag)
    }
  }
}

export function removeTag(card: Card, tag: string) {
    card.tags = card.tags.filter(t => t !== tag)
}

export function sorted(arr: string[]) {
    return [...arr].sort()
}


export function base64ToBytes(base64: string) {
  try {
    const binString = atob(base64)
    return Uint8Array.from([...binString], (m) => m.codePointAt(0)!)
  } catch {
    return Uint8Array.from([])
  }
}

export function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join("")
  return btoa(binString)
}

export function getObjectURL(bblob: BinaryBlob) {
  console.log('toBlobURL', bblob)
  const blob = new Blob([base64ToBytes(bblob.b64)], {type: bblob.type})
  return URL.createObjectURL(blob)
}

export const persistentCache = new Map<string, string>()
export function getPersistentObjectURL(bblob: BinaryBlob) {
  const cached = persistentCache.get(bblob.b64)
  if (cached) {
    return cached
  }
  const blob = new Blob([base64ToBytes(bblob.b64)], {type: bblob.type})
  const url = URL.createObjectURL(blob)
  persistentCache.set(bblob.b64, url)
  return url
}

export function simpleFourColorBBlob() {
  return {
      id: newBinaryId(),
      type: "image/png",
      b64: "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAALElEQVR4nGLRM/NiQAKz7zoic5kY8AKaSrOwJ0oj87/wCtPNbgLSgAAAAP//wIoEF3npdu0AAAAASUVORK5CYII=",
  } as BinaryBlob
}
