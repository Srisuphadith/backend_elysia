import { Elysia, status, t } from "elysia";

class Note {
  constructor(public data: string[] = ['Hello world!!!', '55555'],
    public vale: string[] = ['Hello efefefe!!!', 'efef']
  ) { }
  add(note: string){
    this.data.push(note)
    return this.data
  }
  remove(index: number){
    return this.data.splice(index,1)
  }
  update(index:number,note:string){
    return (this.data[index] = note)
  }

}

export const note = new Elysia()
    .decorate('note',new Note())
    .get('/note', ({ note }) => note.data)
    .get('/note/:index', 
        ({ note, params: { index },status }) => { return note.data[index] ?? status(404,'NOT_FOUND') },
    {
        params: t.Object({
        index: t.Number()
      })
    })