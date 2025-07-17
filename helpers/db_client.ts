import { MongoClient, Db } from "npm:mongodb@6.1.0";

let db: Db;

export function connect() {
  const client = new MongoClient(
    "mongodb+srv://sofiia:vgs0KiA7swRD4Ju1@cluster0.5xlmjrz.mongodb.net?retryWrites=true&w=majority&appName=Cluster0"
  );

  db = client.db("todo-app");
}

export function getDb() {
  return db;
}
