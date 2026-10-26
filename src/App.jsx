import { useState, useEffect } from "react";
import "./App.css";

const STORAGE_KEY = "todo-tasks";

// Read saved tasks from localStorage (runs once, when the app first loads)
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return []; // if the saved data is broken, start with an empty list
  }
}

function App() {
  // Each task looks like: { id, text, completed }
  const [tasks, setTasks] = useState(loadTasks);
  const [newTask, setNewTask] = useState("");
  // The active filter: "all", "pending" or "completed"
  const [filter, setFilter] = useState("all");

  // Save tasks to localStorage every time they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function handleAddTask(event) {
    event.preventDefault(); // stop the form from reloading the page

    const text = newTask.trim();
    if (text === "") return;

    const task = {
      id: crypto.randomUUID(), // unique ID for every task
      text: text,
      completed: false,
    };

    setTasks([...tasks, task]);
    setNewTask("");
  }

  function handleToggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function handleDeleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  // Work out which tasks to show for the current filter
  const visibleTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true; // "all"
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  // Pick the right empty message
  let emptyMessage = "No tasks yet. Add your first task above!";
  if (tasks.length > 0 && filter === "pending") {
    emptyMessage = "No pending tasks. Nice work!";
  } else if (tasks.length > 0 && filter === "completed") {
    emptyMessage = "No completed tasks yet.";
  }

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">My Tasks</h1>

        <p className="stats">
          <span>Total: {totalTasks}</span>
          <span>Completed: {completedTasks}</span>
        </p>

        <form className="task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            className="task-input"
            placeholder="What do you need to do?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            aria-label="New task"
          />
          <button type="submit" className="add-button">
            Add
          </button>
        </form>

        <div className="filters">
          <button
            className={filter === "all" ? "filter-button active" : "filter-button"}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "pending" ? "filter-button active" : "filter-button"}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={filter === "completed" ? "filter-button active" : "filter-button"}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        {visibleTasks.length === 0 ? (
          <p className="empty-message">{emptyMessage}</p>
        ) : (
          <ul className="task-list">
            {visibleTasks.map((task) => (
              <li
                key={task.id}
                className={task.completed ? "task-item completed" : "task-item"}
              >
                <label className="task-label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                  />
                  <span className="task-text">{task.text}</span>
                </label>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteTask(task.id)}
                  aria-label={`Delete task: ${task.text}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
