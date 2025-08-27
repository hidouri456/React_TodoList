import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import todoService from '../services/todoService';

const TodoContext = createContext();

export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodosProvider");
  }
  return context;
}

export function TodosProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      todoService.getAll(token)
        .then(setTasks)
        .catch(error => {
          console.error("Failed to fetch todos:", error);
        });
    } else {
      setTasks([]);
    }
  }, [token]);

  const handleAdd = async () => {
    if (input.trim()) {
      try {
        const newTask = await todoService.create({ text: input }, token);
        setTasks(prevTasks => [...prevTasks, newTask]);
        setInput('');
      } catch (error) {
        console.error("Failed to add task:", error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await todoService.remove(id, token);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const handleUpdate = async () => {
    try {
      const updatedTask = await todoService.update(editId, { text: editText }, token);
      setTasks(tasks.map(task => (task.id === editId ? updatedTask : task)));
      setEditId(null);
      setEditText('');
    } catch (error) {
      console.error("Failed to update task:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  const value = { tasks, input, setInput, editId, editText, setEditText, handleAdd, handleDelete, handleEdit, handleUpdate, handleCancelEdit };

  return (
    <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
  );
}
