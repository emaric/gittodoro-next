class LinkedNode<T> {
  prev?: LinkedNode<T>
  data: T
  next?: LinkedNode<T>
  originalIndex: number

  constructor(data: T, originalIndex: number) {
    this.data = data
    this.originalIndex = originalIndex
  }
}

const createCircularLinkedList = <T>(list: T[]): LinkedNode<T> => {
  const head = new LinkedNode(list[0], 0)

  let node = head
  list.forEach((v, i) => {
    if (i > 0) {
      const cur = node
      node.next = new LinkedNode(v, i)
      node = node.next
      node.prev = cur
    }
  })

  head.prev = node
  node.next = head
  return head
}

export class CircularLinkedList<T> {
  head: LinkedNode<T>
  length: number
  private currentNode: LinkedNode<T>

  constructor(list: T[]) {
    this.length = list.length
    this.head = createCircularLinkedList(list)
    this.currentNode = this.head
  }

  get current(): T {
    return this.currentNode.data
  }

  get originalIndex(): number {
    return this.currentNode.originalIndex
  }

  next(): T {
    if (this.currentNode.next) this.currentNode = this.currentNode.next
    return this.current
  }

  prev(): T {
    if (this.currentNode.prev) this.currentNode = this.currentNode.prev
    return this.current
  }

  toJSON(key: string) {
    let count = 0
    const list = Array.from(Array(this.length)).map((_) => {
      if (count++ == 0) {
        return this.current
      }
      return this.next()
    })

    this.next()
    return list
  }
}
