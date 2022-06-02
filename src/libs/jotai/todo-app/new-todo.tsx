import { useAtom } from "jotai";
import { nanoid } from "nanoid";
import { useState } from "react";
import { todosAtom } from "./store";

const NewTodo = () => {
    const [, setTodos] = useAtom(todosAtom);
    const [text, setText] = useState("");
    const onClick = () => {
        setTodos((prev) => [
            ...prev,
            { id: nanoid(), title: text, done: false },
        ]);
        setText("");
    };
    return (
        <div>
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={onClick} disabled={!text}>
                Add
            </button>
        </div>
    );
};

export default NewTodo;