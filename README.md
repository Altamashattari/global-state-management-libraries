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

## Jotai

Jotai (<https://github.com/pmndrs/jotai>) is a small library for the global state. It's modeled after useState/useReducer and with what are called atoms, which are usually small pieces of state. Unlike Zustand, it is a component state, and like Zustand, it is an immutable update model. The implementation is based on the Context and Subscription patterns.

To understand the Jotai application programming interface (API), let's remind ourselves of a simple counter example and the solution with Context.

Here is an example with two separate counters:

```javascript
const Counter1 = () => {
  const [count, setCount] = useState(0); // [1]
  const inc = () => setCount((c) => c + 1);
  return <>{count} <button onClick={inc}>+1</button></>;
};
const Counter2 = () => {
  const [count, setCount] = useState(0);
  const inc = () => setCount((c) => c + 1);
  return <>{count} <button onClick={inc}>+1</button></>;
};
const App = () => (
  <>
    <div><Counter1 /></div>
    <div><Counter2 /></div>
  </>
);
```

Because these Counter1 and Counter2 components have their own local states, the numbers shown in these components are isolated.

If we want those two components to share a single count state, we can lift the state up and use Context to pass it down.

```javascript
const CountContext = createContext();
const CountProvider = ({ children }) => (
  <CountContext.Provider value={useState(0)}>
    {children}
  </CountContext.Provider>
);
```

Then, the following are the modified components, where we replace useState(0) with useContext(CountContext):

```javascript
const Counter1 = () => {
  const [count, setCount] = useContext(CountContext);
  const inc = () => setCount((c) => c + 1);
  return <>{count} <button onClick={inc}>+1</button></>;
};
const Counter2 = () => {
  const [count, setCount] = useContext(CountContext);
  const inc = () => setCount((c) => c + 1);
  return <>{count} <button onClick={inc}>+1</button></>;
};
```

Finally, we wrap those components with CountProvider, like this:

```javascript
const App = () => (
  <CountProvider>
    <div><Counter1 /></div>
    <div><Counter2 /></div>
  </CountProvider>
);
```

This makes it possible to have a shared count state, and you will see that two count numbers in Counter1 and Counter2 components are incremented at once.

Now, let's see how Jotai is helpful compared to Context. There are two benefits when using Jotai, as follows:

- Syntax simplicity
- Dynamic atom creation

### Syntax simplicity

To understand syntax simplicity, let's look at the same counter example with Jotai. First, we need to import some functions from the Jotai library, as follows:

```js
import { atom, useAtom } from "jotai";
```

The atom function and the useAtom hook are basic functions provided by Jotai.

An atom represents a piece of a state. An atom is usually a small piece of state, and it is a minimum unit of triggering re-renders. The atom function creates a definition of an atom. The atom function takes one argument to specify an initial value, just as useState does. The following code is used to define a new atom:

```javascript
const countAtom = atom(0);
```

Notice the similarity with useState(0).

Now, we use the atom in counter components. Instead of useState(0), we use useAtom(countAtom), as follows:

```js
const Counter1 = () => {
  const [count, setCount] = useAtom(countAtom);
  const inc = () => setCount((c) => c + 1);
  return <>{count} <button onClick={inc}>+1</button></>;
};
const Counter2 = () => {
  const [count, setCount] = useAtom(countAtom);
  const inc = () => setCount((c) => c + 1);
  return <>{count} <button onClick={inc}>+1</button></>;
};
```

Because useAtom(countAtom) returns the same tuple, [count, setCount], as useState(0) does, the rest of the code doesn't need to be changed.

Finally, our App component is the same as in the example which is without Context, as illustrated in the following code snippet:

```js
const App = () => (
  <>
    <div><Counter1 /></div>
    <div><Counter2 /></div>
  </>
);
```

let's suppose you want to add another global state—say, text; you would end up adding the following code:

```js
const TextContext = createContext();
const TextProvider = ({ children }) => (
  <TextContext.Provider value={useState("")}>
    {children}
  </TextContext.Provider>
);
const App = () => (
  <TextProvider>
    ...
  </TextProvider>
);
// When you use it in a component
  const [text, setText] = useContext(TextContext);
```

This is not too bad. What we added is a Context definition and a provider definition, and we wrapped App with the Provider component.

However, the same example could be done with Jotai atoms, as follows:

```js
const textAtom = atom("");
// When you use it in a component
const [text, setText] = useAtom(textAtom);
```

### Dynamic atom creation

The second benefit of Jotai is a new capability—that is, dynamic atom creation. Atoms can be created and destroyed in the React component lifecycle. This is not possible with the multiple-Context approach, because adding a new state means adding a new Provider component. If you add a new component, all its child components will be remounted, throwing away their states.

The implementation of Jotai is based on sharing Component State with Context and Subscription. Jotai's store is basically a WeakMap object (<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap>) of atom config objects and atom values. An atom config object is a definition created with the atom function. An atom value is a value that the useAtom hook returns. Subscription in Jotai is atom-based, which means the useAtom hook subscribes to a certain atom in store. Atom-based Subscription gives the ability to avoid extra re-renders.

### Exploring render optimization

Let's define a new store person with createStore. We define three properties: firstName, lastName, and age, as follows:

```js
const personStore = createStore({
  firstName: "React",
  lastName: "Hooks",
  age: 3,
});
```

Suppose we would like to create a component that shows firstName and lastName. One straightforward way is to select those properties. Here is an example with useStoreSelector:

```js
const selectFirstName = (state) => state.firstName;
const selectLastName = (state) => state.lastName;
const PersonComponent = () => {
  const firstName =
    useStoreSelector(store, selectFirstName);
  const lastName = useStoreSelector(store, selectLastName);
  return <>{firstName} {lastName}</>;
};
```

As we have selected only two properties from the store, when the non-selected property, age, is changed, PersonComponent will not re-render.

This store and selector approach is what we call top-down. We create a store that holds everything and select pieces of state from the store as necessary.

Now, what would Jotai atoms look like for the same example? First, we define atoms, as follows:

```js
const firstNameAtom = atom("React");
const lastNameAtom = atom("Hooks");
const ageAtom = atom(3);
```

Atoms are units of triggering re-renders. You can make atoms as small as you want to control re-renders, like primitive values. But atoms can be objects too.

PersonComponent can be implemented with the useAtom hook, as follows:

```js
const PersonComponent = () => {
  const [firstName] = useAtom(firstNameAtom);
  const [lastName] = useAtom(lastNameAtom);
  return <>{firstName} {lastName}</>;
};
```

Because this has no relationship with ageAtom, PersonComponent won't re-render when the value of ageAtom is changed.

Atoms can be as small as possible, but that means we would probably have too many atoms to organize. Jotai has a notion of derived atoms, where you can create another atom from existing atoms. Let's create a personAtom variable that holds the first name, last name, and age. We can use the atom function, which takes a read function to generate a derived value. The code is illustrated in the following snippet:

```js
const personAtom = atom((get) => ({
  firstName: get(firstNameAtom),
  lastName: get(lastNameAtom),
  age: get(ageAtom),
}));
```

The read function takes an argument called get, with which you can refer to other atoms and get their values. The value of personAtom is an object with three properties—firstName, lastName, and age. This value is updated whenever one of the properties is changed, which means when firstNameAtom, lastNameAtom, or ageAtom is updated. This is called dependency tracking and is automatically done by the Jotai library.

Dependency tracking is dynamic and works for conditional evaluations. For example, suppose a read function is (get) => get(a) ? get(b) : get(c). In this case, if the value of a is truthy, the dependency is a and b, whereas if the value of a is falsy, the dependency is a and c.

Using personAtom, we could re-implement PersonComponent, as follows:

```js
const PersonComponent = () => {
  const person = useAtom(personAtom);
  return <>{person.firstName} {person.lastName}</>;
};
```

However, this is not what we expect. It will re-render when ageAtom changes its value, hence causing extra re-renders.

To avoid extra re-renders, we should create a derived atom including only values we use. Here is another atom, named fullNameAtom this time:

```js
const fullNameAtom = atom((get) => ({
  firstName: get(firstNameAtom),
  lastName: get(lastNameAtom),
}));
```

Using fullNameAtom, we can implement PersonComponent once again, like this:

```js
const PersonComponent = () => {
  const person = useAtom(fullNameAtom);
  return <>{person.firstName} {person.lastName}</>;
};
```

Thanks to fullNameAtom, this doesn't re-render even when the ageAtom value is changed.

We call this a bottom-up approach. We create small atoms and combine them to create bigger atoms. We can optimize re-renders by adding only atoms that will be used in components. The optimization is not automatic, but more straightforward with the atom model.

The benefit of the atom model is that the composition of atoms can easily relate to what will be shown in a component. Thus, it's straightforward to control re-renders. Render optimization with atoms doesn't require the custom equality function or the memoization technique.

Let's look at a counter example to learn more about the derived atoms. First, we define two count atoms, as follows:

```js
const count1Atom = atom(0);
const count2Atom = atom(0);
```

We define a component to use those count atoms. Instead of defining two counter components, we define a single Counter component that works for both atoms. To this end, the component receives countAtom in its props, as illustrated in the following code snippet:

```js
const Counter = ({ countAtom }) => {
  const [count, setCount] = useAtom(countAtom);
  const inc = () => setCount((c) => c + 1);
  return <>{count} <button onClick={inc}>+1</button></>;
};
```

This is reusable for any countAtom configs. Even if we define a new count3Atom config, we don't need to define a new component.

Next, we define a derived atom that calculates the total number of two counts. We use atom with a read function as the first argument, as follows:

```js
const totalAtom = atom(
  (get) => get(count1Atom) + get(count2Atom)
);
```

With the read function, atom will create a derived atom. The value of the derived atom is the result of the read function. The derived atom will re-evaluate its read function and update its value only when dependencies are changed. In this case, either count1Atom or count2Atom is changed.

The Total component is a component to use totalAtom and show the total number, as illustrated in the following code snippet:

```js
const Total = () => {
  const [total] = useAtom(totalAtom);
  return <>{total}</>;
};
```

totalAtom is a derived atom and it's read-only because its value is the result of the read function. Hence, there's no notion of setting a value of totalAtom.

Finally, we define an App component. It passes count1Atom and count2Atom to Counter components, as follows:

```js
const App = () => (
  <>
    (<Counter countAtom={count1Atom} />)
    +
    (<Counter countAtom={count2Atom} />)
    =
    <Total />  
  </>
);
```

Atoms can be passed as props, such as the Counter atom in this example, or they can be passed by any other means—constants at the module level, props, contexts, or even as values in other atoms.

### Understanding how Jotai works to store atom values

First, let's revisit a simple atom definition, countAtom. atom takes an initial value of 0 and returns an atom config, as follows:

```js
const countAtom = atom(0);
```

Implementation-wise, countAtom is an object holding some properties representing the atom behavior. In this case, countAtom is a primitive atom, which is an atom with a value that can be updated with a value or an updating function. A primitive atom is designed to behave like useState.

What is important is that atom configs such as countAtom don't hold their values. We have a store that holds atom values. A store has a WeakMap object whose key is an atom config object and whose value is an atom value.

When we use useAtom, by default, it uses a default store defined at the module level. However, Jotai provides a component named Provider, which lets you create a store at the component level. We can import Provider from the Jotai library along with atom and useAtom, as follows:

```js
import { atom, useAtom, Provider } from "jotai";
```

Let's suppose we have the Counter component defined, as follows:

```js
const Counter = ({ countAtom }) => {
  const [count, setCount] = useAtom(countAtom);
  const inc = () => setCount((c) => c + 1);
  return <>{count} <button onClick={inc}>+1</button></>;
};
```

We then define an App component using Provider. We use two Provider components and put in two Counter components for each Provider component, as follows:

```js
const App = () => (
  <>
    <Provider>
      <h1>First Provider</h1>
      <div><Counter /></div>
      <div><Counter /></div>
    </Provider>
    <Provider>
      <h1>Second Provider</h1>
      <div><Counter /></div>
      <div><Counter /></div>
    </Provider>
  </>
);
```

The two Provider components in App isolate stores. Hence, countAtom used in Counter components is isolated. The two Counter components under the first Provider component share the countAtom value, but the other two Counter components under the second Provider component have different values of countAtom from the value in the first Provider component.

Again, what is important is that countAtom itself doesn't hold a value. Thus, countAtom is reusable for multiple Provider components. This is a notable difference from module states.

We could define a derived atom. Here is a derived atom to define the doubled number of countAtom:

```js
const doubledCountAtom = atom(
  (get) => get(countAtom) * 2
);
```

As countAtom doesn't hold a value, doubledCountAtom doesn't either. If doubledCountAtom is used in the first Provider component, it represents the doubled value of the countAtom value in the Provider component. The same applies to the second Provider component, and the values in the first Provider component can be different from the values in the second Provider component.

Because atom configs are just definitions that don't hold values, the atom configs are reusable. The example shows it's reusable for two Provider components, but essentially, it's reusable for more Provider components. Furthermore, a Provider component can be used dynamically in the React component life cycle. Implementation-wise, Jotai is totally based on Context, and Jotai can do everything that Context can do. We learned that atom configs don't hold values and thus are reusable.

### Adding an array structure

Check source code.

### Using the different features of Jotai

#### Defining the write function of atoms

We have seen how to create a derived atom. For example, doubledCountAtom with countAtom is defined in the Understanding how Jotai works to store atom values section, as follows:

```js
const countAtom = atom(0);
const doubledCountAtom = atom(
  (get) => get(countAtom) * 2
);
```

countAtom is called a primitive atom because it's not derived from another atom. A primitive atom is a writable atom where you can change the value.

doubledCountAtom is a read-only derived atom because its value is fully dependent on countAtom. The value of doubledCountAtom can only be changed by changing the value of countAtom, which is a writable atom.

To create a writable derived atom, the atom function accepts an optional second argument for the write function, in addition to the first argument read function.

For example, let's redefine doubledCountAtom to be writable. We pass a write function that will change the value of countAtom, as follows:

```js
const doubledCountAtom = atom(
  (get) => get(countAtom) * 2,
  (get, set, arg) => set(countAtom, arg / 2)
);
```

The write function takes three arguments, as follows:

- get is a function to return the value of an atom.
- set is a function to set the value of an atom.
- arg is an arbitrary value to receive when updating the atom (in this case, doubledCountAtom).
With the write function, the created atom is writable as if it is a primitive atom. Actually, it is not exactly the same as countAtom because countAtom accepts an updating function such as setCount((c) => c + 1).

We can technically create a new atom that behaves identically to countAtom. What would be the use case? For example, you can add logging, as follows:

```js
const anotherCountAtom = atom(
  (get) => get(countAtom),
  (get, set, arg) => {
    const nextCount = typeof arg === 'function' ?
      arg(get(countAtom)) : arg
    set(countAtom, nextCount)
    console.log('set count', nextCount)
  });
```

anotherCountAtom works like countAtom, and it shows a logging message when it sets a value.

Writable derived atoms are a powerful feature that can help in some complex scenarios. In the next subsection, we'll see another pattern using write functions.

#### Using action atoms

To organize state mutation code, we often create a function or a set of functions. We can use atoms for that purpose and call them action atoms.

To create action atoms, we only use the write function of the atom function's second argument. The first argument can be anything, but we often use null as a convention.

Let's look at an example. We have countAtom as usual and incrementCountAtom, which is an action atom, as follows:

```js
const countAtom = count(0);
const incrementCountAtom(
  null,
  (get, set, arg) => set(countAtom, (c) => c + 1)
);

//usage
const IncrementButton = () => {
  const [, incrementCount] = useAtom(incrementCountAtom);
  return <button onClick={incrementCount}>Click</button>;
};
```

#### Understanding the onMount option of atoms

In some use cases, we want to run certain logic once an atom starts to be used. A good example is to subscribe to an external data source. This can be done with the useEffect hook, but to define logic at the atom level, Jotai atoms have the onMount option.

To understand how it is used, let's create an atom that shows a login message on mount and unmount, as follows:

```js
const countAtom = atom(0);
countAtom.onMount = (setCount) => {
  console.log("count atom starts to be used");
  const onUnmount = () => {
    console.log("count atom ends to be used");
  };
  return onUnmount;
};
```

The body of the onMount function is showing a logging message about the start of use. It also returns an onUnmount function, which shows a logging message about the end of use. The onMount function takes an argument, which is a function to update countAtom.

This is a contrived example, but there are many real use cases to connect external data sources.

#### Introducing the jotai/utils bundle

The Jotai library provides two basic functions, atom and useAtom, and an additional Provider component in the main bundle. While the small API is good to understand the basic features, we want some utility functions to help development.

Jotai provides a separate bundle named jotai/utils that contains a variety of utility functions. For example, atomWithStorage is a function to create atoms with a specific feature—that is, to synchronize with persistent storage. For more information and other utility functions, refer to the project site at <https://github.com/pmndrs/jotai>.
