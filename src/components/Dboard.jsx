import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Dashboard = () => {
  const { userId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${userId}`);
      const data = await response.json();
      setTasks(data.tasks || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.description) return alert("Fill in all fields");

    try {
      const response = await fetch(`http://localhost:3000/tasks/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });

      const data = await response.json();
      setTasks(prev => [...prev, data.task]);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:3000/tasks/delete/${taskId}`, {
        method: 'DELETE'
      });

      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditedTask({ title: task.title, description: task.description });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    const taskId = editingTaskId;
    const { title, description } = editedTask;

    try {
      const res = await fetch(`http://localhost:3000/tasks/update/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description })
      });

      const result = await res.json();
      console.log("🟢 Update result:", result);

      if (res.ok) {
        setTasks(prev =>
          prev.map(task => task._id === taskId ? result.task : task)
        );
        setEditingTaskId(null);
      } else {
        alert("Update failed: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Update failed");
    }
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("profileImage", result.filename); // ✅ Save filename in localStorage
        alert("Profile photo uploaded!");
      } else {
        alert(result.error || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Server error");
    }
  };


  return (
    <div className="db-section">
      <h2>User Dashboard</h2>

      <div className="add-task">
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={newTask.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Task description"
          value={newTask.description}
          onChange={handleInputChange}
        />
      </div>

      <div className="btnw">
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="task-grid">
          {tasks.map(task => (
            <div className="task-card" key={task._id}>
              {editingTaskId === task._id ? (
                <>
                  <input
                    name="title"
                    value={editedTask.title}
                    onChange={handleEditChange}
                  />
                  <input
                    name="description"
                    value={editedTask.description}
                    onChange={handleEditChange}
                  />
                  <div className="card-buttons">
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={() => setEditingTaskId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <h4>{task.title}</h4>
                  <p style={{ fontSize: "large" }}>{task.description}</p>
                  <p className="created-date">
                    Created: {task.createdAt ? new Date(task.createdAt).toLocaleString() : "Unknown"}
                  </p>
                  <div className="card-buttons">
                    <button onClick={() => handleEditClick(task)}>Edit</button>
                    <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
