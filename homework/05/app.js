import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT)");

const router = new Router();

router
  .get('/', list)
  .get('/post/new', add)
  .get('/post/:id', show)
  .post('/post', create)
  .get('/search', searchForm)
  .post('/search', search);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
  if (ctx.request.url.pathname.startsWith("/public/")) {
    await send(ctx, ctx.request.url.pathname, {
      root: Deno.cwd(),
      index: "index.html",
    });
  }
});

function query(sql, params = []) {
  let list = []
  for (const [id, title, body] of db.query(sql, params)) {
    list.push({ id, title, body })
  }
  return list
}

async function list(ctx) {
  let posts = query("SELECT id, title, body FROM posts")
  ctx.response.body = await render.list(posts);
}

async function add(ctx) {
  ctx.response.body = await render.newPost();
}

async function show(ctx) {
  const pid = ctx.params.id;
  let posts = query(`SELECT id, title, body FROM posts WHERE id=?`, [pid])
  let post = posts[0]
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(post);
}

async function create(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    const pairs = await body.value
    const post = {}
    for (const [key, value] of pairs) {
      post[key] = value
    }
    db.query("INSERT INTO posts (title, body) VALUES (?, ?)", [post.title, post.body]);
    ctx.response.redirect('/');
  }
}

function searchForm(ctx) {
  ctx.response.body = render.searchForm();
}

async function search(ctx) {
    const body = ctx.request.body()
    if (body.type === "form") {
      const pairs = await body.value
      const searchName = pairs.get('name');
      const posts = query("SELECT id, title, body FROM posts WHERE title LIKE ?", [`%${searchName}%`]);
      if (posts.length > 0) {
        const firstPostId = posts[0].id;
        ctx.response.redirect(`/post/${firstPostId}`);
      } else {
        ctx.response.body = '查無此人';
      }
    }
  }
  

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
