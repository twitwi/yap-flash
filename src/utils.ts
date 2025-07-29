import type { Card } from "./typing"

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