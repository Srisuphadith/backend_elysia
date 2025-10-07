import { Elysia, t } from "elysia";
import { openapi } from '@elysiajs/openapi';
import { cors } from '@elysiajs/cors'
import { signin, register } from './sql';


const app = new Elysia({ prefix: "/api" })
  .use(openapi())
  .post('/login', ({ body: { username, password } }) => signin(username, password), { body: t.Object({ username: t.String(), password: t.String() }) })
  .put('/register', ({ body: { firstname, lastname, username, password,email } }) => register(firstname, lastname, username, password,email), { body: t.Object({ firstname: t.String(), lastname: t.String(), username: t.String(), password: t.String(),email:t.String() }) })
  .use(cors())
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
