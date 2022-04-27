import { CircularLinkedList } from '../../models/CircularLinkedList'

describe('[LinkedList] unit tests', () => {
  describe('when trying to create a circular linked list', () => {
    it('should print the matching order when traversing next node', () => {
      const list = [1, 2, 3, 4, 5]

      const linkedList = new CircularLinkedList(list)

      const result = list.map((_, i) => {
        if (i == 0) {
          return linkedList.current
        }
        return linkedList.next()
      })

      expect(result).toEqual(list)
    })

    it('should print the reverse order when traversing prev node', () => {
      const list = [1, 2, 3, 4, 5]

      const linkedList = new CircularLinkedList(list)

      const result = list.map((_, i) => {
        return linkedList.prev()
      })

      expect(result).toEqual(list.reverse())
    })
  })
})
