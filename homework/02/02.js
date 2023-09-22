import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const nqu = new Map();
nqu.set("01", {
    href:"https://www.nqu.edu.tw/">金門大學
});
nqu.set("02", {
    href:"https://csie.nqu.edu.tw//">金門大學資工系
});

const to = new Map();
to.set("11", {
    ctx:response.redirect('https://csie.nqu.edu.tw//')
});
to.set("12", {
    ctx:response.redirect('https://csie.nqu.edu.tw//')
});

const room = new Map();
room.set("e320", {
  title: "多媒體教室",
});
room.set("e319", {
  room: "嵌入式實驗室",
});

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "/nqu/01  顯示金門大學超連結";
    context.response.body = "/nqu/02 顯示金門大學資工系超連結";
    context.response.body = "/to/11 轉到金門大學網站!";
    context.response.body = "/to/12 轉到金門大學資工系";
    context.response.body = "room/e320 => 多媒體教室";
    context.response.body = " /room/e319 => 嵌入式實驗室";
  })
  .get("/nqu", (context) => {
    context.response.body = Array.from(nqu.values());
  })
  .get("/nqu/:id", (context) => {
    if (context.params && context.params.id && nqu.has(context.params.id)) {
      context.response.body = nqu.get(context.params.id);
    }
  })
  .get("/to", (context) => {
    context.response.body = Array.from(to.values());
  })
  .get("/to/:id", (context) => {
    if (context.params && context.params.id && to.has(context.params.id)) {
      context.response.body = to.get(context.params.id);
    }
  })
  .get("/room", (context) => {
    context.response.body = Array.from(room.values());
  })
  .get("/room/:id", (context) => {
    if (context.params && context.params.id && room.has(context.params.id)) {
      context.response.body = room.get(context.params.id);
    }
  });


const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });