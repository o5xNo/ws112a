import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';

const posts = [
  { id: 0, title: '孫悟空', body: '0909090909' },
  { id: 1, title: '豬八戒', body: '0988888888' },
];

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

async function list(ctx) {
  ctx.response.body = await render.list(posts);
}

async function add(ctx) {
  const content = await render.newPost() + render.searchForm();
  ctx.response.body = content;
}

async function show(ctx) {
  const id = ctx.params.id;
  const post = posts[id];
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(post);
}

async function create(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const post = {};
    for (const [key, value] of pairs) {
      post[key] = value;
    }
    console.log('post=', post);
    const id = posts.push(post) - 1;
    post.created_at = new Date();
    post.id = id;
    ctx.response.redirect('/');
  }
}

function searchForm(ctx) {
  ctx.response.body = render.searchForm();
}

async function search(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const searchName = pairs.get('name');
    const result = searchByName(searchName);
    if (result) {
      ctx.response.body = render.show(result.title, result.body);
    } else {
      ctx.response.body = '查無此人';
    }
  }
}

function searchByName(name) {
  const foundPost = posts.find(post => post.title === name);
  return foundPost ? { title: foundPost.title, body: foundPost.body } : null;
}

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });