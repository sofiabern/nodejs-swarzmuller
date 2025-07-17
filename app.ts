import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import todosRoutes from "./deno/routes/todos.ts";
import { connect } from "./helpers/db_client.ts";

connect()

const app = new Application();

app.use(async (_, next) => {
  console.log("Middleware!");
  await next();
});

app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE"
  );
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  await next();
});

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 3000 });
