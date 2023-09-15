import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

function page(body) {
  return `<html>
  <head>
  <style>
  </style>
  </head>
  <body>
  ${body}
  </body>
  </html>`
}

app.use((ctx) => {
  console.log('ctx.request.url=', ctx.request.url)
  let pathname = ctx.request.url.pathname

  if (pathname.startsWith("/nqu/csie/")) { //(ctx.request.url.pathname=="/nqu/csie")
    ctx.response.body = page(`
    <a href="https://csie.nqu.edu.tw//">金門大學資工系</a>
    `)
  }
  else if (pathname.startsWith("/nqu/")) {
    ctx.response.body = page(`
    <a href="https://www.nqu.edu.tw/">金門大學</a>
    `)
  } 

  else if (pathname.startsWith("/to/nqu/csie/")) {
    ctx.response.redirect('https://csie.nqu.edu.tw//');
  }

  else if (pathname.startsWith("/to/nqu/")) {
    ctx.response.redirect('https://www.nqu.edu.tw/');
  }

  else {
    ctx.response.body = page(`
      <h1>404</h1>
      <p>/nqu/  顯示金門大學超連結</p>
      <p>/nqu/csie/ 顯示金門大學資工系超連結</p>
      <p>/to/nqu/ 轉到金門大學網站</p>
      <p>/to/nqu/csie/ 轉到金門大學資工系</p>
    `)
  }

});

console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });