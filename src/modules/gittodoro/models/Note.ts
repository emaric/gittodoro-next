export class Note {
  id: string
  date: Date
  content: string
  updatedAt?: Date

  constructor({ id, date, content, updatedAt }: Note) {
    this.id = id
    this.date = date
    this.content = content
    this.updatedAt = updatedAt ? updatedAt : date
  }
}
