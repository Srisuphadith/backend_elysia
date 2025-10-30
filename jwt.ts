// 1️⃣ Install first (run in your terminal)
// bun add @elysiajs/jwt

// 2️⃣ Import & set up
import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'

// secret can be any random string (keep it safe!)
const JWT_SECRET = 'my‑super‑secret‑12345'

const app = new Elysia()
  // 👉 Register the JWT plugin
  .use(
    jwt({
      // the property name added to the context (default: "jwt")
      name: 'jwt',
      // secret used to sign / verify tokens
      secret: JWT_SECRET,
      // optional: store token in a signed httpOnly cookie
      cookie: {
        name: 'auth',          // cookie name
        httpOnly: true,
        path: '/',             // sent on every request
        maxAge: 7 * 24 * 60 * 60, // 1 week
      },
    })
  )

  // 3️⃣ Sign‑in route – returns a token and also sets it as a cookie
  .post('/login', async ({ jwt, body, cookie }) => {
    // In a real app you’d validate `body.username/password` first
    const payload = { userId: body.username }

    // sign returns the raw JWT string
    const token = await jwt.sign(payload)

    // also write it to the cookie defined above
    cookie.auth.set({
      value: token,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
    })

    return { token } // handy for SPA clients
  }, {
    // validation of the request body (optional but recommended)
    body: {
      username: 'string',
      password: 'string',
    },
  })

  // 4️⃣ Protected route – verifies token from cookie *or* Authorization header
  .get('/profile', async ({ jwt, cookie, headers, error }) => {
    // Try cookie first
    let token = cookie.auth?.value

    // Fallback to Bearer header (`Authorization: Bearer <jwt>`)
    if (!token && headers.authorization?.startsWith('Bearer '))
      token = headers.authorization.split(' ')[1]

    // If we still have no token → unauthorized
    if (!token) return error('Unauthorized', 401)

    // Verify token – returns the decoded payload or null
    const payload = await jwt.verify(token)

    if (!payload) return error('Invalid token', 401)

    // 🎉 Authorized! You can now use `payload` (e.g., userId)
    return { message: `Hello ${payload.userId}!` }
  })

  .listen(3000)

console.log('🦊 Elysia listening on http://localhost:3000')