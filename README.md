# Introducing Global State Libraries

## Zustland

`npm i zustand`

Zustand (<https://github.com/pmndrs/zustand>) is a tiny library primarily designed to create module state for React. It's based on an immutable update model, in which state objects can't be modified but always have to be newly created.

Render optimization is done manually using selectors. It has a straightforward and yet powerful store creator interface.

### Understanding module state and immutable state

Zustand is a library that's used to create a store that holds a state. It's primarily designed for module state, which means you define this store in a module and export it. It's based on the immutable state model, in which you are not allowed to modify state object properties. Updating states must be done by creating new objects, while unmodified state objects must be reused. The benefit of the immutable state model is that you only need to check state object referential equality to know if there's any update; you don't have to check equality deeply.

The following is a minimal example that can be used to create a count state. It takes a store creator function that returns an initial state:

```javascript
// store.ts
import create from "zustand";
export const store = create(() => ({ count: 0 }));
```

store exposes some functions such as `getState`, `setState`, and `subscribe`. You can use getState to get the state in store and setState to set the state in store:

```javascript
console.log(store.getState()); // ---> { count: 0 }
store.setState({ count: 1 });
console.log(store.getState()); // ---> { count: 1 }
```

The state is immutable, and you can't mutate it like you can ++state.count. The following example is an invalid usage that violates the state's immutability:

```javascript
const state1 = store.getState();
state1.count = 2; // invalid
store.setState(state1);
```

state1.count = 2 is the invalid usage, so it doesn't work as expected. With this invalid usage, the new state has the same reference as the old state, and the library can't detect the change properly.

The state must be updated with a new object such as store.setState({ count: 2 }).

The store.setState function also accepts a function to update:

```javascript
store.setState((prev) => ({ count: prev.count + 1 }));
```

This is called a function update, and it makes it easy to update the state with the previous state.

The state can have multiple properties. The following example has an additional text property:

```javascript
export const store = create(() => ({
  count: 0,
  text: "hello",
}));
```

Again, the state must be updated immutably, like so:

```javascript
store.setState({
  count: 1,
  text: "hello",
});
```

However, store.setState() will merge the new state and the old state. Hence, you can only specify the properties you want to set:

```javascript
console.log(store.getState());
store.setState({
  count: 2,
});
console.log(store.getState());
```

The first console.log statement outputs { count: 1, text: 'hello' }, while the second one outputs { count: 2, text: 'hello' }.

As this only changes count, the text property isn't changed. Internally, this is implemented with Object.assign(), as follows:

```javascript
Object.assign({}, oldState, newState);
```

The Object.assign function will return a new object by merging the oldState and newState properties.

The last piece of the store function is store.subscribe. The store.subscribe function allows you to register a callback function, which will be invoked every time the state in store is updated. It works like this:

```javascript
store.subscribe(() => {
  console.log("store state is changed");
});
store.setState({ count: 3 });
```

With the store.setState statement, the store state is changed message will be shown on the console, thanks to the subscription. store.subscribe is an important function for implementing React hooks.

The Zustand state model is perfectly in line with this object immutability assumption (or convention). Zustand's render optimization with selector functions is also based on immutability – that is, if a selector function returns the same object referentially (or value), it assumes that the object is not changed and avoids re-rendering.

Zustand having the same model as React gives us a huge benefit in terms of library simplicity and its small bundle size.

On the other hand, a limitation of Zustand is its manual render optimization with selectors. It requires that we understand object referential equality and the code for selectors tends to require more boilerplate code.

In summary, Zustand – or any other libraries with this approach – is a simple addition to the React principle. It's a good recommendation if you need a library with a small bundle size, if you are familiar with referential equality and memoization, or you prefer manual render optimization.
