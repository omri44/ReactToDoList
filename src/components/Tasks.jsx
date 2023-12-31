import React, { useEffect, useState } from 'react';
import './Tasks.css';
import { Accessibility, Trash2, FileEdit, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { wait } from '../lib/utils';
import { error, success } from '../lib/notification';

export const Tasks = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [todoIndex, setTodoIndex] = useState(-1);
  const [onClickCheck, setCnClickCheck] = useState(false);

  useEffect(() => {
    const todosInStorage = JSON.parse(localStorage.getItem('todos'));
    if (todosInStorage) {
      setTodos(todosInStorage);
    }
  }, [todo]);

  const handleAddTodo = async () => {
    if (!todo) return;
    setCnClickCheck(true);
    await wait(1000);
    try {
      if (todoIndex > -1) {
        todos[todoIndex] = todo;
        setTodoIndex(-1);
        localStorage.setItem('todos', JSON.stringify(todos));
      } else {
        const allTodos = [...todos, todo];
        localStorage.setItem('todos', JSON.stringify(allTodos));
        success('Task added successfully');
      }
      setTodo('');
    } catch (err) {
      error(err?.message);
    } finally {
      setCnClickCheck(false);
    }
  };

  const handleDeleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const handleUpdateTodo = (index) => {
    setTodo(todos[index]);
    setTodoIndex(index);
  };

  const handleClearAllTodo = () => {
    if(window.confirm("Are you sure you want to delete all tasks?"))
    setTodos([]);
    localStorage.removeItem('todos');
  };

  return (
    <div className='container'>
      <div>
        <input
          onChange={({ target }) => setTodo(target.value)}
          value={todo}
          className='task-input'
          disabled={onClickCheck}
          placeholder='Add a new task...'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddTodo();
            }
          }}
        />
        {!onClickCheck ? (
          <Accessibility
            onClick={handleAddTodo}
            className='task-icon'
            style={{ cursor: todo ? 'pointer' : 'not-allowed' }}
          />
        ) : (
          <Accessibility className='task-icon loading' />
        )}
      </div>
      <div className='todos-wrapper'>
        {todos?.map((todo, index) => (
          <div className='todo-item' key={index}>
            <Link to={`/todo/${index}`} className='todo-link'>
              <span style={{ opacity: todoIndex === index ? 0.5 : 1 }}>
                {index + 1}.{todo}
              </span>
            </Link>
            <div>
              <FileEdit
                onClick={() => handleUpdateTodo(index)}
                className='pencil-icon'
              />
              <Trash2
                onClick={() => handleDeleteTodo(index)}
                className='trash-icon'
              />
            </div>
          </div>
        ))}
        <div className='todo-item'>
          {(todoIndex === -1 && onClickCheck) && (
            <span style={{ opacity: 0.5 }}>{todos.length + 1}.{todo}</span>
          )}
        </div>
      </div>
      <div>
        {todos.length > 0 && (
          <button onClick={handleClearAllTodo} className='clear-all-button'>
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};
