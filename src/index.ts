import { Elysia, status, t } from "elysia";
import { openapi } from '@elysiajs/openapi';
//import {note} from './note';
import {fetchUsers,password_validation} from './sql';

const app = new Elysia()
  .use(openapi())
  //.use(note)
  .get('/fetch',() => fetchUsers())
  .post('/api/login',({ body : {username,pass}})=> password_validation(username,pass),{body:t.Object({username:t.String(),pass:t.String()})})
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
