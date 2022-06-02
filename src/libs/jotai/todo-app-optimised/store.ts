import { atom, PrimitiveAtom } from "jotai";

export type Todo = {
    title: string;
    done: boolean;
};

// reate a TodoAtom type with PrimitiveAtom, which is a generic type exported by the Jotai library.
export type TodoAtom = PrimitiveAtom<Todo>;

// The name is explicit, to tell that it's an atom that represents an array of TodoAtom. This structure is why the pattern is named Atoms-in-Atom.
export const todoAtomsAtom = atom<TodoAtom[]>([]);

