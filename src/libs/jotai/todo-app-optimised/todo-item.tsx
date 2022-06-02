import { useAtom } from "jotai";
import { memo } from "react";
import { TodoAtom } from "./store";

const TodoItem = ({
    todoAtom,
    remove,
}: {
    todoAtom: TodoAtom;
    remove: (todoAtom: TodoAtom) => void;
}) => {
    const [todo, setTodo] = useAtom(todoAtom);
    return (
        <div>
            <input
                type="checkbox"
                checked={todo.done}
                onChange={() => setTodo(
                    (prev) => ({ ...prev, done: !prev.done })
                )}
            />
            <span
                style={{
                    textDecoration:
                        todo.done ? "line-through" : "none",
                }}
            >
                {todo.title}
            </span>
            <button onClick={() => remove(todoAtom)}>
                Delete
            </button>
        </div>
    );
};
export const MemoedTodoItem = memo(TodoItem);

// Thanks to the useAtom config in the TodoItem component, the onChange callback is very simple and only cares about the item. It doesn't depend on the fact that it's an item of the array.
