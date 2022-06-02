import { JotaiTodoApp } from "./libs/jotai/todo-app/todo-app";
import { ZustandApp } from "./libs/zustland/example-2/ZustandApp";
import { TodoApp } from "./libs/zustland/todo-app/todoApp";

function App() {
  return (
    <div>
      <ZustandApp />
      <TodoApp />
      <JotaiTodoApp />
    </div>
  );
}

export default App;
