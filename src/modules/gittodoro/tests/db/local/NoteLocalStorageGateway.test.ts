import Note from '@emaric/gittodoro-ts/lib/interactor/entities/Note'
import { NoteLocalStorageGateway } from '@/modules/gittodoro/db/local/NoteLocalStorageGateway'

import '@/modules/gittodoro/tests/MockLocalStorage'

describe('[NoteLocalStorageGateway] unit tests', () => {
  describe('when executing CRUD commands for notes', () => {
    const gateway = new NoteLocalStorageGateway()
    let sampleNote: Note
    let updatedNote: Note

    it('should create new Note on create command', async () => {
      const [createdNote] = await gateway.create([
        {
          content: 'This is a sample note.',
          date: new Date('2022-04-17T09:00:00.000Z'),
        },
      ])
      sampleNote = createdNote

      const actual = localStorage.getItem(NoteLocalStorageGateway.NOTES_ID)
      const expected =
        '{"id":"1","date":"2022-04-17T09:00:00.000Z","content":"This is a sample note."}]'

      expect(actual?.includes(expected)).toBe(true)
    })

    it('should return a Note with the given id on read command', async () => {
      const [note] = await gateway.readByIDs([sampleNote.id])
      const actual = note
      const expected = sampleNote
      expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected))
    })

    it('should update the note on update command', async () => {
      const [_updatedNote] = await gateway.update([
        {
          ...sampleNote,
          content: 'This is an updated Note. -THIS SHOULD BE INCLUDED-',
          updatedAt: new Date('2022-04-17T20:00:00.000Z'),
        },
      ])
      updatedNote = _updatedNote

      const actual = localStorage.getItem(NoteLocalStorageGateway.NOTES_ID)
      const expected =
        '{"id":"1","date":"2022-04-17T09:00:00.000Z","updatedAt":"2022-04-17T20:00:00.000Z","content":"This is an updated Note. -THIS SHOULD BE INCLUDED-"}]'

      expect(actual?.endsWith(expected)).toBe(true)
    })

    it('should delete the note with the given id', async () => {
      // assert that the targetId exists
      const targetId = updatedNote.id
      const [note] = await gateway.readByIDs([targetId])
      expect(JSON.stringify(note)).toEqual(JSON.stringify(updatedNote))

      await gateway.deleteByIDs([targetId])
      await expect(gateway.readByIDs([targetId])).resolves.toEqual([])
    })
  })
})
