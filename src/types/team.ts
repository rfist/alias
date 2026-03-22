export interface Team {
  id: string
  name: string
  score: number
  order: number  // fixed cyclic play order, cannot be changed by user
}
