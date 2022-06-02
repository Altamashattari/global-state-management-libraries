import create from "zustand";

export type Todo = {
    id: number;
    title: string;
    done: boolean;
};

export type StoreState = {
    todos: Todo[];
    addTodo: (title: string) => void;
    removeTodo: (id: number) => void;
    toggleTodo: (id: number) => void;
};

let nextId = 0;
export const useStore = create<StoreState>((set) => ({
    todos: [],
    addTodo: (title) =>
        set((prev) => ({
            todos: [
                ...prev.todos,
                { id: ++nextId, title, done: false },
            ],
        })),
    removeTodo: (id) =>
        set((prev) => ({
            todos: prev.todos.filter((todo) => todo.id !== id),
        })),
    toggleTodo: (id) =>
        set((prev) => ({
            todos: prev.todos.map((todo) =>
                todo.id === id ? { ...todo, done: !todo.done } :
                    todo
            ),
        })),
}));

// Notice that the addTodo, removeTodo, and toggleTodo functions are implemented in an immutable manner. They don't mutate existing objects and arrays; they create new ones instead.