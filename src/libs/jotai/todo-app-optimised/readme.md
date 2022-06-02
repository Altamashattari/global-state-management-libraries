# Concerns regarding first approach of todo-list

There are two concerns, though, from the developer's perspective, as follows:

- The first concern is we need to modify the entire todos array to mutate a single item. In the toggleTodo function, it needs to iterate over all the items and mutate just one item. In the atomic model, it would be nice if we could simply mutate one item. This is also related to performance. When todos array items are mutated, the todos array itself is changed. Thus, TodoList re-renders. Thanks to MemoedTodoItem, the MemoedTodoItem components don't re-render unless the specific item is changed. Ideally, we want to trigger those specific MemoedTodoItem components to re-render.

- The second concern is the id value of an item. The id value is primarily for key in map, and it would be nice if we could avoid using id.

With Jotai, we propose a new pattern, Atoms-in-Atom, with which we put atom configs in another atom value. This pattern addresses the two concerns and is more consistent with Jotai's mental model.

Let's summarize the difference with the Atoms-in-Atom pattern, as follows:

- An array atom is used to hold an array of item atoms.
- To add a new item in the array, we create a new atom and add it.
- Atom configs can be evaluated as strings, and they return UIDs.
- A component that renders an item uses an item atom in each component. It eases mutating the item value and avoids extra re-renders naturally.
