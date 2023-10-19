import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
 
const peoples = new Map();
peoples.set("isme", {
  name: "isme",
  ps: "145214522",
});
peoples.set("malala", {
  name: "malala",
  ps: "5186161",
});

const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.body = ctx.response.redirect('http://127.0.0.1:8000/public/index.html');
  })
  .get("/people", (ctx) => {
    ctx.response.body = Array.from(peoples.values());
  })
  .post("/people/add", async (ctx) => {
    const body = ctx.request.body()
    if (body.type === "form") {
      const pairs = await body.value
      console.log('pairs=', pairs)
      const params = {}
      for (const [key, value] of pairs) {
        params[key] = value
      }
      console.log('params=', params)
      let name = params['name']
      let ps = params['ps']
      console.log(`name=${name} ps=${ps}`)
      if (peoples.get(name)) {
        ctx.response.type = 'text/html'
        ctx.response.body = `<p>此帳號已存在</p><p><a href="http://127.0.0.1:8000/public/add.html">註冊</a></p>`
      } else {
        peoples.set(name, {name, pass})
        ctx.response.type = 'text/html'
        ctx.response.body = `<p>註冊成功</p><p><a href="http://127.0.0.1:8000/public/find.html">登入</a></p>`
      }
  
    }

  })
  .post("/people/find",async (ctx) => {
    const body = ctx.request.body()
    if (body.type === "form") {
      const pairs = await body.value
      console.log('pairs=', pairs)
      const params = {}
      for (const [key, value] of pairs) {
        params[key] = value
      }
      console.log('params=', params)
      let name = params['name']
      let ps = params['ps']
      console.log(`name=${name} pass=${pass}`)
      if (peoples.get(name) && ps==peoples.get(name).ps) {
        ctx.response.type = 'text/html'
        ctx.response.body = '登入成功'
      } 
      else {
        ctx.response.type = 'text/html'
        ctx.response.body = `<p>登入失敗</p><p><a href="http://127.0.0.1:8000/public/find.html">重新登入</a></p>`
      }
  }
})
  .get("/public/(.*)", async (ctx) => {
    let wpath = ctx.params[0]
    console.log('wpath=', wpath)
    await send(ctx, wpath, {
      root: Deno.cwd()+"/public/",
      index: "index.html",
    })
  })

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log('start at : http://127.0.0.1:8000')

await app.listen({ port: 8000 });