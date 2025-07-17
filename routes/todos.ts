import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getDb } from "../helpers/db_client.ts";
import { ObjectId} from "npm:mongodb@6.1.0";


const router = new Router();

type Todo = {
  _id: ObjectId;
  text: string;
};

let todos: Todo[] = [];



router.get("/todos", async (ctx) => {
const todos = await getDb().collection<Todo>("todos").find().toArray();

const transformedTodos = todos.map((todo) => ({
  id: todo._id.toString(),
  text: todo.text,
}));

ctx.response.body = {todos: transformedTodos}

});

router.post("/todos", async (ctx) => {
  const body = ctx.request.body({ type: "json" });
  const value = await body.value;

  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: value.text,
  };

  todos.push(newTodo);

  ctx.response.body = { message: "Created todo!", todo: newTodo };
});

router.put("/todos/:todoId", async (ctx) => {
  const body = ctx.request.body({ type: "json" });
  const value = await body.value;
  const tId = ctx.params.todoId;

  const todoIndex = todos.findIndex((todo) => {
    return todo.id === tId;
  });

  todos[todoIndex] = { id: todos[todoIndex].id, text: value.text };

  ctx.response.body = { message: "Updated todo!" };
});

router.delete("/todos/:todoId", (ctx) => {
  const tId = ctx.params.todoId;
  todos = todos.filter((todo) => todo.id !== tId);

  ctx.response.body = { message: "Deleted todo" };
});

export default router;
