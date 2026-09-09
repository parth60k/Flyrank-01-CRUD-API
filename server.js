require('dotenv').config();

const express = require("express");

const taskRepository = require("./repositories/taskRepository");


const pool = require('./db');

pool.query("SELECT NOW()", (err, result) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Database connected:", result.rows[0]);
    }
});



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



/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: List of all tasks
 */
app.get("/tasks",async(req,res)=>{
    try{
        const tasks= await taskRepository.getAllTasks();

        res.json(tasks);
    } catch(error){
        console.error(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
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
app.get("/tasks/:id",async(req,res) =>{
    const id=Number(req.params.id);

    try{
        const task= await taskRepository.getTaskById(id);

        if(!task){
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json(task);
    }catch (error){
        console.error(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
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
app.post("/tasks",async (req,res)=>{
    const {title}= req.body;

    if(!title || title.trim() === ""){
        return res.status(400).json({
            error:"Title is required" 
        });
    }

    try{
        const newTask = await taskRepository.createTask(title.trim());

        res.status(201).json(newTask);
    }catch (error){
        console.error(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
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
app.put("/tasks/:id", async(req,res)=>{
    const id=Number(req.params.id);

   try{
    const existingTask= await taskRepository.getTaskById(id);

    if(!existingTask){
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const {title,done} =req.body;

    if(title === undefined && done === undefined){
        return res.status(400).json({
            error:"Provide title or done"
        });
    }

    if(title !== undefined){
        if(typeof title !=="string" || title.trim()===""){
            return res.status(400).json({
                error: "Title must be a non empty string"
            });
        }
    }
    if(done!==undefined){
        if(typeof done !=="boolean"){
            return res.status(400).json({
                error:"Done must be a boolean"
            });
        }
    }

    const updatedTask= await taskRepository.updateTask(id,title!== undefined ? title.trim(): undefined, done);

    res.json(updatedTask);

   }catch (error){
    console.error(error);

    res.status(500).json({
        error: "Internal server error"
    });
   }

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
app.delete("/tasks/:id",async (req,res)=>{
    const id= Number(req.params.id);

    try{
        const deletedTask= await taskRepository.deleteTask(id);
        
        if(!deletedTask){
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(204).send();
    }catch (error){
        console.error(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});