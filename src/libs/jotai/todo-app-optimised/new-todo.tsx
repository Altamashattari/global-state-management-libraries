import { useAtom, atom } from "jotai";
import { useState } from "react";
import { todoAtomsAtom, Todo } from "./store";

export const NewTodo = () => {
    const [, setTodoAtoms] = useAtom(todoAtomsAtom);
    const [text, setText] = useState("");
    const onClick = () => {
        setTodoAtoms((prev) => [
            ...prev,
            atom<Todo>({ title: text, done: false }),
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