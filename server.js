const express = require("express");
const Database = require("better-sqlite3");

const db= new Database("tasks.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done BOOLEAN NOT NULL DEFAULT 0
    )
`).run();

const taskCount= db.prepare("SELECT COUNT(*) AS count FROM tasks").get();

if(taskCount.count===0){
    const insert= db.prepare(`
        INSERT INTO tasks (title,done)
        VALUES (?,?)
        `);

        insert.run("Learn Express",0);
        insert.run("Build CRUD API",0);
        insert.run("Learn SQLite",0);
}

const swaggerUi=require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

const PORT = 3000;

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task API",
            version: "1.0.0",
            description: "A simple CRUD API for managing tasks"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./server.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

const tasks = [
    {
        id: 1,
        title: "Learn Express",
        done: false
    },
    {
        id: 2,
        title: "Build CRUD API",
        done: false
    },
    {
        id: 3,
        title: "Push project to GitHub",
        done: true
    }
];

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: List of all tasks
 */
app.get("/tasks", (req, res) => {
    const tasks=db.prepare("SELECT * FROM tasks").all();

    res.json(tasks);
});

app.get("/", (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task found
 *       404:
 *         description: Task not found
 */
app.get("/tasks/:id",(req,res) =>{
    const id=Number(req.params.id);

    const task= db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(id);

    if(!task){
        return res.status(404).json({
            error : "Task not found"
        });
    }

    res.json(task);
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 *       400:
 *         description: Title is required
 */
app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    const result =db.prepare(`
        INSERT INTO tasks (title,done)
        VALUES(?,?)
        `).run(title.trim(),0);

    const newTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(result.lastInsertRowid);

    res.status(201).json(newTask);
});


/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               done:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task updated
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Task not found
 */
app.put("/tasks/:id",(req,res)=>{
    const id=Number(req.params.id);

    const task=db
    .prepare(`SELECT * FROM tasks WHERE id = ?`)
    .get(id);

    if(!task){
        return res.status(404).json({
            error: "Task not found"
        });
    }
    const {title,done} =req.body;

    if(title === undefined && done === undefined){
        return res.status(400).json({
            error: "Provide title or done"
        });
    }

    if(title!== undefined){
        if(typeof title !=="string" || title.trim()===""){
            return res.status(400).json({
                error: "Title must be a non-empty string"
            });
        }
    }

    if(done !== undefined){
        if(typeof done !== "boolean"){
            return res.status(400).json({
                error: "Done must be a boolean"
            });
        }
    }

    const updates =[];
    const values = [];

    if(title!==undefined){
        updates.push("title = ?");
        values.push(title.trim());
    }

    if(done!== undefined){
        updates.push("done = ?");
        values.push(done ?1 :0);
    }

    values.push(id);

    db.prepare(` 
        UPDATE tasks
        SET ${updates.join(",")}
        where id = ?
    `).run(...values);

    const updatedTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(id);

    res.json(updatedTask);

});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(id);

    if(!task){
        return res.status(404).json({
            error: "Task not found"
        });
    }

    db.prepare("DELETE FROM tasks WHERE id = ?").run(id);

    res.status(204).send();
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});