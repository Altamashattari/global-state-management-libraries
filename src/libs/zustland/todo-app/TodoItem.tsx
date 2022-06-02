import { memo } from "react";
import { StoreState, Todo, useStore } from "./store";

const selectRemoveTodo =
    (state: StoreState) => state.removeTodo;
const selectToggleTodo =
    (state: StoreState) => state.toggleTodo;

const TodoItem = ({ todo }: { todo: Todo }) => {
    const removeTodo = useStore(selectRemoveTodo);
    const toggleTodo = useStore(selectToggleTodo);
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
            >
                Delete
            </button>
        </div>
    );
}

export default memo(TodoItem);

/*
It is important to use the memoized component here to avoid extra re-renders. 
Because we update the store state in an immutable manner, most of the todo objects
in the todos array are not changed. If the todo object we pass to the MemoedTodoItem
props is not changed, the component won't re-render. Whenever the todos array is changed,
the TodoList component re-renders. However, its child components only re-render 
if the corresponding todo item is changed.
*/