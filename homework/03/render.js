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
    
        #people {
          margin: 0;
          padding: 0;
        }
    
        #people li {
          margin: 40px 0;
          padding: 0;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
          list-style: none;
        }
    
        #people li:last-child {
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
    `
  }
  
  export function list(people) {
    let list = []
    for (let post of people) {
      list.push(`
      <li>
        <h2>${ person.title }</h2>
        <p><a href="/post/${person.id}">Read post</a></p>
      </li>
      `)
    }
    let content = `
    <h1>聯絡人</h1>
    <p>您有<strong>${ppeople.length}</strong> 個聯絡人!</p>
    <p><a href="/post/new">新增聯絡人</a></p>
    <ul id="people">
      ${list.join('\n')}
    </ul>
    `
    return layout('People', content)
  }
  
  export function newPost() {
    return layout('新聯絡人', `
    <h1>新聯絡人</h1>
    <p>輸入新聯絡人的資料</p>
    <form action="/person" method="person">
      <p><input type="text" placeholder="姓名" name="title"></p>
      <p><textarea placeholder="電話" name="body"></textarea></p>
      <p><input type="submit" value="新增"></p>
    </form>
    `)
  }
  
  export function show(person) {
    return layout(person.title, `
      <h1>${person.title}</h1>
      <pre>${person.body}</pre>
    `)
  }
  