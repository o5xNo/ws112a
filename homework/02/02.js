import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const room = new Map();
room.set("e320", {
  room: "多媒體教室",
});
room.set("e319", {
  room: "嵌入式實驗室",
});

const router = new Router();
router
  .get("", (context) => {
    context.response.body = "/nqu/  顯示金門大學超連結 \n/nqu/csie/ 顯示金門大學資工系超連結 \n/to/nqu/ 轉到金門大學網站 \n/to/nqu/csie/ 轉到金門大學資工系 \n/room/e320 => 多媒體教室 \n/room/e319 => 嵌入式實驗室";
  })

  .get("/nqu/", (context) => {
    context.response.body = `
    <html>
        <body>
            <a href="https://www.nqu.edu.tw/">金門大學</a>
        </body>
    </html>
    `
  })
  .get("/nqu/csie/", (context) => {
    context.response.body =`
    <html>
        <body>
            <a href="https://csie.nqu.edu.tw/">金門大學資工系</a>
        </body>
    </html>
    `
  })

  .get("/to/nqu/", (context) => {
    context.response.redirect('https://www.nqu.edu.tw/')
  })
  .get("/to/nqu/csie/", (context) => {
    context.response.redirect('https://csie.nqu.edu.tw/')
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