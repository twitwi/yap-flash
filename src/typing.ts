
export type CardType = 'basic' | 'unimplemented'
export type CardId = string

export type Card = {
  id: CardId
  type: CardType
  front: string
  back: string
  tags: string[]
}

export const Outcomes = ['trivial', 'ok', 'guess', 'almost', 'wrong', 'stop', 'skip' ] as const
export type Outcome = typeof Outcomes[number]
// 'trivial' // easy, almost too easy
// 'ok' // good, ok with some effort
// 'guess' // guessed but guessed ok
// 'almost' // had part/almost the answer
// 'wrong' // again to be shown as the answer was wrong
// 'stop' | 'skip' // just for interaction-logging purpose


export type View = {
  cardId: CardId
  when: number // Date.now()
  outcome: Outcome
  comment?: string
}

