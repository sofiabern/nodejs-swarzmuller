import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getDb } from "../helpers/db_client.ts";
import { ObjectId } from "npm:mongodb@6.1.0";

const router = new Router();

type MongoTodo = {
  _id: ObjectId;
  text: string;
};
type Todo = {
  id?: string;
  text: string;
};

router.get("/todos", async (ctx) => {
  const todos = await getDb().collection<MongoTodo>("todos").find().toArray();

  const transformedTodos = todos.map((todo) => ({
    id: todo._id.toString(),
    text: todo.text,
  }));

  ctx.response.body = { todos: transformedTodos };
});

router.post("/todos", async (ctx) => {
  const body = ctx.request.body({ type: "json" });
  const value = await body.value;

  const newTodo: Todo = {
    text: value.text,
  };

  const result = await getDb().collection("todos").insertOne(newTodo);

  newTodo.id = result.insertedId.toString();

  ctx.response.body = { message: "Created todo!", todo: newTodo };
});

router.put("/todos/:todoId", async (ctx) => {
  const body = ctx.request.body({ type: "json" });
  const value = await body.value;
  const tId = ctx.params.todoId!;

  await getDb()
    .collection("todos")
    .updateOne({ _id: new ObjectId(tId) }, { $set: { text: value.text } });

  ctx.response.body = { message: "Updated todo!" };
});

router.delete("/todos/:todoId", async (ctx) => {
  const tId = ctx.params.todoId;

  await getDb()
    .collection("todos")
    .deleteOne({ _id: new ObjectId(tId) });

  ctx.response.body = { message: "Deleted todo" };
});

export default router;
