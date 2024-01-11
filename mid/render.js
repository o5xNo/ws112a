export function layout(title, content) {
  return `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            padding: 80px;
            font: 16px Helvetica, Arial;
            background: url('snow.gif') fixed;
            background-size: cover;
          }

          h1 {
            font-size: 2em;
          }

          h2 {
            font-size: 1.2em;
          }

          #posts {
            margin: 0;
            padding: 0;

          #posts li {
            margin: 40px 0;
            padding: 0;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
            list-style: none;
          }

          #posts li:last-child {
            border-bottom: none;
          }

          textarea {
            width: 500px;
            height: 300px;
          }

          input[type=text], input[type=password], textarea {
            border: 1px solid #eee;
            border-top-color: #ddd;
            border-left-color: #ddd;
            border-radius: 2px;
            padding: 15px;
            font-size: .8em;
          }

          input[type=text], input[type=password] {
            width: 500px;
          }
        </style>
      </head>
      <body>
        <section id="content">
          ${content}
        </section>
      </body>
    </html>
  `;
}


export function loginUi() {
  return layout('Login', `
    <h1>登入</h1>
    <form action="/login" method="post">
      <p><input type="text" placeholder="用戶id" name="username"></p>
      <p><input type="password" placeholder="密碼" name="password"></p>
      <p><input type="submit" value="登入"></p>
      <p><a href="/signup">註冊</a></p>
    </form>
  `);
}

export function signupUi() {
  return layout('Signup', `
    <h1>註冊</h1>
    <form action="/signup" method="post">
      <p><input type="text" placeholder="用戶id" name="username"></p>
      <p><input type="password" placeholder="密碼" name="password"></p>
      <p><input type="text" placeholder="email" name="email"></p>
      <p><input type="submit" value="註冊"></p>
    </form>
  `);
}

export function success() {
  return layout('Success', `
    <h1>恭喜你註冊成功!</h1>
    你可以<a href="/login">登入</a>
  `);
}

export function fail() {
  return layout('Fail', `
    <h1>錯誤</h1>
    你可以<a href="/login">登入</a>或<a href="JavaScript:window.history.back()">返回</a> !
  `);
}

export function list(posts, user) {
  // 日記列表
  let list = posts.map((post) => {
    return `
      <li>
        <h2>${post.title} -- by ${post.username}</h2>
        <p><a href="/post/${post.id}">查看日記內容</a></p>
        ${(user && user.username === post.username) ?
          `<p>
            <a href="/post/edit/${post.id}">編輯</a> | 
            <a href="/post/delete/${post.id}" onclick="return confirm('確定要刪除嗎？')">刪除</a>
          </p>` : ''}
      </li>
    `;
  }).join('');

  // 頁面內容
  let content = `
    <h1>${user.username}的日記</h1>
    <p>${(user == null) ? '<a href="/login">登入</a>創建資料' : '歡迎' + user.username + '，您可以 <a href="/post/new">編寫新日記</a> or <a href="/logout">登出</a> !'}</p>
    <p>共有<strong>${posts.length}</strong>篇日記!</p>
    <ul id="posts">
      ${list}
    </ul>
    <p><a href="/rankings">查看排行榜</a></p>
  `;
  return layout('Posts', content);
}

export function newPost() {
  return layout('New Post', `
    <h1>新聯絡人</h1>
    <p>輸入新聯絡人的資料</p>
    <form action="/post" method="post">
      <p><label for="postDate">選擇日期：</label>
      <input type="date" id="postDate" name="title" required></p>
      <p><textarea placeholder="電話" name="body"></textarea></p>
      <p><input type="submit" value="新增"></p>
    </form>
  `);
}

export function show(post) {
  return layout(post.title, `
    <h1>${post.title} -- by ${post.username}</h1>
    <p>${post.body}</p>
    <a href="/">返回</a>
  `);
}

export function edit(post) {
  return layout('Edit Post', `
    <h1>編輯聯絡人</h1>
    <p>修改聯絡人的資料</p>
    <form action="/post/update/${post.id}" method="post">
      <p><label for="postDate">選擇日期：</label>
      <input type="date" id="postDate" name="title" value="${post.title}" required></p>
      <p><textarea placeholder="電話" name="body">${post.body}</textarea></p>
      <p><input type="submit" value="儲存修改"></p>
    </form>
  `);
}
