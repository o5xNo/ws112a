import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'

const people = [
  {id:0, title:'孫悟空', body:'0909090909'},
  {id:1, title:'豬八戒', body:'0988888888'}
];

const router = new Router();

router.get('/', list)
  .get('/person/new', add)
  .get('/person/:id', show)
  .post('/person', create);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

async function list(ctx) {
  ctx.response.body = await render.list(people);
}

async function add(ctx) {
  ctx.response.body = await render.newPost();
}

async function show(ctx) {
  const id = ctx.params.id;
  const person = people[id];
  if (!person) ctx.throw(404, 'invalid person id');
  ctx.response.body = await render.show(person);
}

async function create(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    const pairs = await body.value
    const person = {}
    for (const [key, value] of pairs) {
      person[key] = value
    }
    console.log('person=', person)
    const id = people.push(person) - 1;
    person.created_at = new Date();
    person.id = id;
    ctx.response.redirect('/');
  }
}

console.log('Server run at http://127.0.0.1:8000')
await app.listen({ port: 8000 });
