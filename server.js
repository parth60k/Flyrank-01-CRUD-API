const express = require("express");

const app = express();

const PORT = 3000;

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



app.get("/tasks", (req, res) => {
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

app.get("/tasks/:id",(req,res) =>{
    const id=Number(req.params.id);

    const task=tasks.find(task=>task.id===id);

    if(!task){
        return res.status(404).json({
            error: "Tasks not found"
        });
    }

    res.json(task);
});

app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    const newTask = {
        id: tasks.length + 1,
        title: title.trim(),
        done: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});