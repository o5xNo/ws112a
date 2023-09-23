export function layout(title, content) {
  return `
  <html>
  <head>
    <title>${title}</title>
    <style>
      body {
        padding: 80px;
        font: 16px Helvetica, Arial;
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
      }
  
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
  
      input[type=text],
      textarea {
        border: 1px solid #eee;
        border-top-color: #ddd;
        border-left-color: #ddd;
        border-radius: 2px;
        padding: 15px;
        font-size: .8em;
      }
  
      input[type=text] {
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

export function list(posts) {
  let listItems = [];
  for (let post of posts) {
    listItems.push(`
    <li>
      <h2>${post.title}</h2>
      <p><a href="/post/${post.id}">詳細資料</a></p>
    </li>
    `);
  }
  let content = `
  <h1>聯絡人</h1>
  <p>您有<strong>${posts.length}</strong> 個聯絡人!</p>
  <p><a href="/post/new">新增聯絡人</a></p>
  <p><a href="/search">查詢</a></p>
  <ul id="posts">
    ${listItems.join('\n')}
  </ul>
  `;
  return layout('Posts', content);
}

export function newPost() {
  return layout('New Post', `
  <h1>新聯絡人</h1>
  <p>輸入新聯絡人的資料</p>
  <form action="/post" method="post">
    <p><input type="text" placeholder="姓名" name="title"></p>
    <p><textarea placeholder="電話" name="body"></textarea></p>
    <p><input type="submit" value="新增"></p>
  </form>
  `);
}
export function searchForm() {
  return layout('Search', `
    <h1>搜索联系人</h1>
    <form action="/search" method="post">
      <p><input type="text" placeholder="姓名" name="name"></p>
      <p><input type="submit" value="搜索"></p>
    </form>
  `);
}

export function show(titleOrPost, body) {
  if (typeof titleOrPost === 'string') {
    return layout(titleOrPost, `
      <h1>${titleOrPost}</h1>
      <p>${body}</p>
    `);
  } else if (typeof titleOrPost === 'object' && titleOrPost !== null) {
    return layout(titleOrPost.title, `
      <h1>${titleOrPost.title}</h1>
      <pre>${titleOrPost.body}</pre>
    `);
  }
}