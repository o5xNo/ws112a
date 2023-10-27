import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";

const posts = [
  { id: 0, title: '孫悟空', body: '0909090909' },
  { id: 1, title: '豬八戒', body: '0988888888' },
];

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, title TEXT, body TEXT)");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT)");

const router = new Router();

router
  .get('/signup', signupUi)
  .post('/signup', signup)
  .get('/login', loginUi)
  .post('/login', login)
  .get('/logout', logout)
  .get('/', list)
  .get('/post/new', add)
  .get('/post/:id', show)
  .post('/post', create)
  .get('/search', searchForm)
  .post('/search', search);

  const app = new Application();
  app.use(Session.initMiddleware());
  app.use(router.routes());
  app.use(router.allowedMethods());

function sqlcmd(sql, arg1) {
  console.log('sql:', sql)
  try {
    var results = db.query(sql, arg1)
    console.log('sqlcmd: results=', results)
    return results
  } catch (error) {
    console.log('sqlcmd error: ', error)
    throw error
  }
}

function postQuery(sql) {
  let list = []
  for (const [id, username, title, body] of sqlcmd(sql)) {
    list.push({id, username, title, body})
  }
  console.log('postQuery: list=', list)
  return list
}

function userQuery(sql) {
  let list = []
  for (const [id, username, password, email] of sqlcmd(sql)) {
    list.push({id, username, password, email})
  }
  console.log('userQuery: list=', list)
  return list
}

async function parseFormBody(body) {
  const pairs = await body.value
  const obj = {}
  for (const [key, value] of pairs) {
    obj[key] = value
  }
  return obj
}

async function signupUi(ctx) {
  ctx.response.body = await render.signupUi();
}

async function signup(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    var user = await parseFormBody(body)
    var dbUsers = userQuery(`SELECT id, username, password, email FROM users WHERE username='${user.username}'`)
    if (dbUsers.length === 0) {
      sqlcmd("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [user.username, user.password, user.email]);
      ctx.response.body = render.success()
    } else 
      ctx.response.body = render.fail()
  }
}

async function loginUi(ctx) {
  ctx.response.body = await render.loginUi();
}

async function login(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    var user = await parseFormBody(body)
    var dbUsers = userQuery(`SELECT id, username, password, email FROM users WHERE username='${user.username}'`) // userMap[user.username]
    var dbUser = dbUsers[0]
    if (dbUser.password === user.password) {
      ctx.state.session.set('user', user)
      console.log('session.user=', await ctx.state.session.get('user'))
      ctx.response.redirect('/');
    } else {
      ctx.response.body = render.fail()
    }
  }
}

async function logout(ctx) {
   ctx.state.session.set('user', null)
   ctx.response.redirect('/')
}

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