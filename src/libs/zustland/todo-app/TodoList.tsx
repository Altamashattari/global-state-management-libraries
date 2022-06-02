import { StoreState, useStore } from "./store";
import MemoedTodoItem from './TodoItem';

const selectTodos = (state: StoreState) => state.todos;

export const TodoList = () => {
  const todos = useStore(selectTodos);
  return (
    <div>
      {todos.map((todo) => (
        <MemoedTodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};