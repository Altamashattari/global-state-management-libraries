import { memo } from "react";
import { Todo } from "./store";

const TodoItem = ({
    todo,
    removeTodo,
    toggleTodo,
  }: {
    todo: Todo;
    removeTodo: (id: string) => void;
    toggleTodo: (id: string) => void;
  }) => {
    return (
      <div>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => toggleTodo(todo.id)}
        />
        <span
          style={{
            textDecoration:
              todo.done ? "line-through" : "none",
          }}
        >
          {todo.title}
        </span>
        <button
          onClick={() => removeTodo(todo.id)}
        >Delete</button>
      </div>
    );
  };

export default memo(TodoItem);