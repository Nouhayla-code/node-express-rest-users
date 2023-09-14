import express from "express";
import fs from "fs/promises";
import connection from "./database.js";
import cors from "cors";
import { error, log } from "console";

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json()); // To parse JSON bodies
app.use(cors()); // Enable CORS for all routes

app.get("/", (request, response) => {
  response.send("Node.js Users REST API 🎉");
});

async function getUsersFromJSON() {
  const data = await fs.readFile("data.json");
  const users = JSON.parse(data);
  users.sort((userA, userB) => userA.name.localeCompare(userB.name));
  return users;
}

// READ all users
app.get("/users", (request, response) => {
  const query = "SELECT * FROM users ORDER BY NAME;";
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      response.json(results);
    }
  });
});

// READ one user
app.get("/users", (request, response) => {
  const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger med "det" id.
  const query = "SELECT * FROM users WHERE id=?;"; // sql query
  const values = [id];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      response.json(results[0]);
    }
  });
});

// CREATE user
app.post("/users", (request, response) => {
  const user = request.body;
  const query = "INSERT INTO users(name, mail, title, image) values(?,?,?,?);";

  const values = [user.name, user.mail, user.title, user.image];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      response.json(results);
    }
  });
});

// UPDATE user
app.put("/users/:id", (request, response) => {
  const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger med "det" id.
  const user = request.body;
  const query =
    "UPDATE users SET name=?, mail =?, title=?, image=? WHERE id=?;"; //sql query
  const values = [user.name, user.mail, user.title, user.image, id];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      response.json(results);
    }
  });
});

// DELETE user
app.delete("/users/:id", async (request, response) => {
  const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger med "det" id.
  const query = "DELETE FROM users WHERE id=?;";

  const values = [id];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      response.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log(`App listening on http://localhost:${port}`);
  console.log(`Users Endpoint http://localhost:${port}/users`);
});
