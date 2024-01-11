import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, title TEXT, body TEXT)");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT)");

const router = new Router();

router.get('/', list)
  .get('/signup', signupUi)
  .post('/signup', signup)
  .get('/login', loginUi)
  .post('/login', login)
  .get('/logout', logout)
  .get('/post/new', add)
  .get('/post/:id', show)
  .post('/post', create)
  .get('/post/delete/:id', deletePost)
  .get('/post/edit/:id', edit)
  .get('/rankings', showRankings)
  .post('/post/update/:id', update);



const app = new Application();
app.use(Session.initMiddleware());
app.use(router.routes());
app.use(router.allowedMethods());

function sqlcmd(sql, arg1) {
  console.log('sql:', sql);
  try {
    var results = db.query(sql, arg1);
    console.log('sqlcmd: results=', results);
    return results;
  } catch (error) {
    console.log('sqlcmd error: ', error);
    throw error;
  }
}

function postQuery(sql) {
  let list = [];
  for (const [id, username, title, body] of sqlcmd(sql)) {
    list.push({ id, username, title, body });
  }
  console.log('postQuery: list=', list);
  return list;
}

function userQuery(sql) {
  let list = [];
  for (const [id, username, password, email] of sqlcmd(sql)) {
    list.push({ id, username, password, email });
  }
  console.log('userQuery: list=', list);
  return list;
}

async function parseFormBody(body) {
  const pairs = await body.value;
  const obj = {};
  for (const [key, value] of pairs) {
    obj[key] = value;
  }
  return obj;
}

async function signupUi(ctx) {
  ctx.response.body = await render.signupUi();
}

async function signup(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    var user = await parseFormBody(body);
    var dbUsers = userQuery(`SELECT id, username, password, email FROM users WHERE username='${user.username}'`);
    if (dbUsers.length === 0) {
      sqlcmd("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [user.username, user.password, user.email]);
      ctx.response.body = render.success();
    } else {
      ctx.response.body = render.fail();
    }
  }
}

async function loginUi(ctx) {
  ctx.response.body = await render.loginUi();
}

async function login(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    var user = await parseFormBody(body);
    var dbUsers = userQuery(`SELECT id, username, password, email FROM users WHERE username='${user.username}'`);
    var dbUser = dbUsers[0];
    if (dbUser.password === user.password) {
      ctx.state.session.set('user', user);
      console.log('session.user=', await ctx.state.session.get('user'));
      ctx.response.redirect('/');
    } else {
      ctx.response.body = render.fail();
    }
  }
}

async function logout(ctx) {
  ctx.state.session.set('user', null);
  ctx.response.redirect('/');
}

async function list(ctx) {
  const user = await ctx.state.session.get('user');
  if (user) {
    let posts = postQuery(`SELECT id, username, title, body FROM posts WHERE username='${user.username}'`);
    console.log('list:posts=', posts);
    ctx.response.body = await render.list(posts, user);
  } else {
    ctx.response.redirect('/login');
  }
}

async function add(ctx) {
  var user = await ctx.state.session.get('user');
  if (user != null) {
    ctx.response.body = await render.newPost();
  } else {
    ctx.response.body = render.fail();
  }
}

async function show(ctx) {
  const pid = ctx.params.id;
  let posts = postQuery(`SELECT id, username, title, body FROM posts WHERE id=${pid}`);
  let post = posts[0];
  if (!post) ctx.throw(404, 'invalid post id');
  const content = await render.show(post);
  ctx.response.body = layout('日記內容', content);
}

async function create(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    var post = await parseFormBody(body);
    console.log('create:post=', post);
    var user = await ctx.state.session.get('user');
    if (user != null) {
      console.log('user=', user);
      sqlcmd("INSERT INTO posts (username, title, body) VALUES (?, ?, ?)", [user.username, post.title, post.body]);
    } else {
      ctx.throw(404, 'not login yet!');
    }
    ctx.response.redirect('/');
  }
}

async function deletePost(ctx) {
  const pid = ctx.params.id;
  sqlcmd("DELETE FROM posts WHERE id=?", [pid]);
  ctx.response.redirect('/');
}

async function edit(ctx) {
  const pid = ctx.params.id;
  let posts = postQuery(`SELECT id, username, title, body FROM posts WHERE id=${pid}`);
  let post = posts[0];
  console.log('edit:post=', post);
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.edit(post);
}

async function update(ctx) {
  const pid = ctx.params.id;
  const body = ctx.request.body();
  if (body.type === "form") {
    var post = await parseFormBody(body);
    console.log('update:post=', post);
    sqlcmd("UPDATE posts SET title=?, body=? WHERE id=?", [post.title, post.body, pid]);
    ctx.response.redirect('/');
  }
}

// 假設 generateRankings 函數接收帖子列表，返回用戶排名的陣列
function generateRankings(posts) {
  const userPostCount = {};

  // 遍歷所有的帖子，統計每個用戶的發帖數
  for (const post of posts) {
    const username = post.username;
    if (username in userPostCount) {
      userPostCount[username]++;
    } else {
      userPostCount[username] = 1;
    }
  }

  // 將統計的數據轉換為陣列並排序
  const rankings = Object.entries(userPostCount)
    .map(([username, postCount]) => ({ username, postCount }))
    .sort((a, b) => b.postCount - a.postCount);

  return rankings;
}


async function showRankings(ctx) {
  try {
    console.log('Entering showRankings');

    // 從數據庫中獲取所有的帖子
    let posts = postQuery("SELECT id, username, title, body FROM posts");
    console.log('Posts:', posts);

    // 使用帖子數據生成排行榜
    let rankings = generateRankings(posts);
    console.log('Rankings:', rankings);

    let rankingList = rankings.map((ranking, index) => {
      return `<li>${index + 1}. ${ranking.username} - ${ranking.postCount} 篇日記</li>`;
    }).join('');

    let content = `
      <h1>排行榜</h1>
      <ul id="rankings">
        ${rankingList}
      </ul>
      <a href="/">返回</a>
    `;
    ctx.response.body = layout('排行榜', content);

    console.log('Exiting showRankings');
  } catch (error) {
    console.error('Error in showRankings:', error);
    ctx.response.body = 'Internal Server Error';
    ctx.response.status = 500;
  }
}

// 假設 layout 函數接收標題和內容，返回一個包含 HTML 的頁面
function layout(title, content) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;
}




console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });