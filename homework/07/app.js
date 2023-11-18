import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT)");


const posts = [
  { id: 0, title: '孫悟空', body: '0909090909' },
  { id: 1, title: '豬八戒', body: '0988888888' },
];

const router = new Router()

router.get('/', (ctx)=>ctx.response.redirect('/public/index.html'))
  .get('/list', list)
  .get('/post/:id', show)
  .post('/post', create)
  .get('/public/(.*)', pub)

app.use(router.routes())
app.use(router.allowedMethods())

async function pub(ctx) {
  console.log('path=', ctx.request.url.pathname)
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}/`,
    index: "index.html",
  })
}

async function list (ctx) {
  ctx.response.type = 'application/json'
  ctx.response.body = posts
}

async function show (ctx) {
  const id = ctx.params.id
  const post = posts[id]
  if (!post) ctx.throw(404, 'invalid post id')
  ctx.response.type = 'application/json'
  ctx.response.body = post
}

async function create (ctx) {
  const body = ctx.request.body();
  console.log('body = ', body)
  if (body.type === "json") {
    let post = await body.value
    post.id = posts.length
    posts.push(post)
    ctx.response.body = 'success'
    console.log('create:save=>', post)
  }
}

console.log('Server run at http://127.0.0.1:8001')
await app.listen({ port: 8001 })