// import { Elysia, t } from "elysia";
// import { openapi } from '@elysiajs/openapi';
// import { cors } from '@elysiajs/cors'
// import { signin, register } from './sql';


// const app = new Elysia({ prefix: "/api" })
//   .use(openapi())
//   .post('/login', ({ body: { username, password } }) => signin(username, password), { body: t.Object({ username: t.String(), password: t.String() }) })
//   .put('/register', ({ body: { firstname, lastname, username, password,email } }) => register(firstname, lastname, username, password,email), { body: t.Object({ firstname: t.String(), lastname: t.String(), username: t.String(), password: t.String(),email:t.String() }) })
//   .use(cors())
//   .listen(3000);

// console.log(
//   `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
// );
import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { writeFile } from 'node:fs/promises';
import { randomBytes } from 'crypto'
import pkjson from '../package.json' assert { type: 'json' };
const { exec } = require('child_process');

function randomFileName(original: string) {
	const ext = original.split('.').pop() ?? '';
	console.log(ext)
	return `${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
}
async function storeFile(file: File): Promise<string> {
	const buffer = Buffer.from(await file.arrayBuffer());
	const path = `./uploads/${randomFileName(file.name)}`;
	await writeFile(path, buffer);
	return path;
}

const app = new Elysia()
app.use(cors())
// app.get("/test",()=>console.log(pkjson.name))
app.post("/", ({ body: { auth } }) => {
	const data = new Object()
	if (auth == "1234") {

		data.firstname = "srisuphadith"
		data.lastname = "Rattanaprasert"
		data.isAuth = 1
		return data
	}
	data.isAuth = 0
	data.firstname = ""
	data.lastname = ""
	return data

}, { body: t.Object({ auth: t.String() }) })

// upload image
app.post(
	'/image',
	async ({ body: { image, title } }) => {

		console.log('📸 Received image:', image.name, 'size:', image.size)
		const ress = await storeFile(image)
		console.log(ress)
		return {
			ok: true,
			title,
			filename: image.name,
			mime: image.type,
			size: image.size
		}
	},
	{
		body: t.Object({
			// Optional text field
			title: t.Optional(t.String()),
			// 👉 Single file – accepts any image MIME type
			image: t.File({ accept: ['image/*'] })
			// If you want to allow *multiple* images:
			// images: t.Files({ accept: ['image/*'] })
		})
	}
)
app.post("/test", () => "Hello world")
app.listen(3000)
//github auto refresh
app.post("/github/webhook", ({ body }) => {
	if (body.repository.name != pkjson.name) {
		console.log("Repository miss match")
		return
	}
	//console.log(body)
	exec('bash script.sh', (error, stdout, stderr) => {
		console.log("run git pull script")
		if (error) {
			console.error(`exec error: ${error}`);
			return
		}
		console.log(`stdout: ${stdout}`);
		if (stderr) {
			console.error(`stderr: ${stderr}`);
		}
	})
})

console.log('Listening on http://localhost:3000')