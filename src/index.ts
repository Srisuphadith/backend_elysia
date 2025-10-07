import { Elysia, t } from "elysia";
import { openapi } from '@elysiajs/openapi';
import { cors } from '@elysiajs/cors'
import { login_validation, create_user } from './sql';


const app = new Elysia({ prefix: "/api" })
  .use(openapi())
  .post('/login', ({ body: { username, password } }) => login_validation(username, password), { body: t.Object({ username: t.String(), password: t.String() }) })
  .put('/register', ({ body: { firstname, lastname, username, password,email } }) => create_user(firstname, lastname, username, password,email), { body: t.Object({ firstname: t.String(), lastname: t.String(), username: t.String(), password: t.String(),email:t.String() }) })
  .use(cors())
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
