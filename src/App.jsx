
import './App.css';
import { useTodos } from './components/TodoContext.jsx';
import { useAuth } from './components/AuthContext.jsx';

function App() {
  const {
    tasks,
    input,
    setInput,
    editId,
    editText,
    setEditText,
    handleAdd,
    handleDelete,
    handleEdit,
    handleUpdate,
    handleCancelEdit,
  } = useTodos();
  const { user, logout } = useAuth(); 

  return (
    <div className="todo-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="todo-title">Todo List</h1>
          {user && <p style={{ margin: 0, color: '#888' }}>Welcome, {user.name}!</p>}
        </div>
        <button className="todo-delete-btn" onClick={logout}>Logout</button>
      </div>
      <div className="todo-input-group">
        <input
          className="todo-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a task"
        />
        <button className="todo-add-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul className="todo-list">
        {tasks.map(task => (
          <li className={`todo-item${editId === task.id ? ' editing' : ''}`} key={task.id}>
            {editId === task.id ? (
              <>
                <input
                  className="todo-edit-input"
                  type="text"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
                <button className="todo-update-btn" onClick={handleUpdate}>Update</button>
                <button className="todo-cancel-btn" onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <span className="todo-text">{task.text}</span>
                <button className="todo-edit-btn" onClick={() => handleEdit(task.id, task.text)}>Edit</button>
                <button className="todo-delete-btn" onClick={() => handleDelete(task.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
