import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { cloneState } from "https://deno.land/x/oak@v12.6.1/structured_clone.ts";

const router = new Router();

interface Todo {
  id: string;
  text: string;
}

let todos: Todo[] = [];

router.get("/todos", (ctx) => {
  ctx.response.body = { todos: todos };
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
