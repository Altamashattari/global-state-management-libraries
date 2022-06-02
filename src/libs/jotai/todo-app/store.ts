import { atom } from "jotai";

export type Todo = {
    id: string;
    title: string;
    done: boolean;
};

// We annotate the atom() function with the Todo[] type.
export const todosAtom = atom<Todo[]>([]);


