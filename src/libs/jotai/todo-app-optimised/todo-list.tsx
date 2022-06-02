import { useAtom } from "jotai";
import { useCallback } from "react";
import { todoAtomsAtom, TodoAtom } from "./store";
import { MemoedTodoItem } from "./todo-item";

export const TodoList = () => {
    const [todoAtoms, setTodoAtoms] =
        useAtom(todoAtomsAtom);
    const remove = useCallback(
        (todoAtom: TodoAtom) => setTodoAtoms(
            (prev) => prev.filter((item) => item !== todoAtom)
        ),
        [setTodoAtoms]
    );
    return (
        <div>
            {todoAtoms.map((todoAtom) => (
                <MemoedTodoItem
                    key={`${todoAtom}`}
                    todoAtom={todoAtom}
                    remove={remove}
                />
            ))}
        </div>
    );
};

// TodoList maps over the todoAtoms variable and renders MemoedTodoItem for each todoAtom config. For key in map, we specify the stringified todoAtom config. An atom config returns a unique identifier (UID) when evaluated as a string, thus we don't need to manage string IDs by ourselves. The behavior of the TodoList component is slightly different from the previous version. Because it deals with Atoms-in-Atom, todoAtomsAtom won't be changed if one of the items is toggled with toggleTodo. Thus, it can reduce some extra re-renders by nature.