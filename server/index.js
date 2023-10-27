const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors({
  origin: 'http://localhost:3000'
}));

const db = mysql.createPool({
  port: 3306,
  host: "localhost",
  user: "root",
  password: "",
  database: "employeeSystem",
});

app.use(express.json());

// Define tables and relationships
// Departments Table
db.query(`
  CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )
`);

// Employees Table
db.query(`
  CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT,
    position VARCHAR(255),
    wage INT,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
  )
`);

app.post("/create", (req, res) => {
  const name = req.body.name;
  const age = req.body.age;
  const position = req.body.position;
  const wage = req.body.wage;
  const department_id = req.body.department_id;

  db.query(
    "INSERT INTO employees (name, age, position, wage, department_id) VALUES (?, ?, ?, ?, ?)",
    [name, age, position, wage, department_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Employee Inserted");
      }
    }
  );
});

app.get("/employees", (req, res) => {
  // Join employees and departments to get department names
  db.query(`
    SELECT employees.id, employees.name, employees.age, employees.position, employees.wage, departments.name AS department
    FROM employees
    JOIN departments ON employees.department_id = departments.id
  `, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/update", (req, res) => {
  const id = req.body.id;
  const wage = req.body.wage;

  db.query(
    "UPDATE employees SET wage = ? WHERE id = ?",
    [wage, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM employees WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(3001, () => {
  console.log("✅ Server running on port: 3001");
});
