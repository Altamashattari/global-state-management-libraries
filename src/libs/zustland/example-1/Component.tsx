import { useStore } from "./store";

// The useStore hook, if it's invoked, returns the entire state object, including all its properties. 
// This component shows the count value and that whenever the store state is changed, it will re-render. 
// While this works fine of the time, if only the text value is changed and the count value is not changed, 
// the component will output essentially the same JavaScript Syntax Extension (JSX) element and users won't see any change onscreen. 
// Hence, this means that changing the text value causes extra re-renders.
export const ZustandComponent = () => {
    const { count } = useStore();
    return <div>count: {count}</div>;
};

// When we need to avoid extra re-renders, we can specify a selector function; that is, useStore. 
// The previous component can be rewritten with a selector function, as follows:
// This selector-based extra re-render control is what we call manual render optimization. The way the selector works to avoid re-renders is to compare the results of what the selector function returns. You need to be careful when you're defining a selector function to return stable results to avoid re-renders.
export const ZustandComponentOptimised = () => {
    // By making this change, but only when the count value is changed, the component will re-render.
    const count = useStore((state) => state.count);
    return <div>count: {count}</div>;
};

/*

For example, the following example doesn't work well because the selector function creates a new array with a new object in it:

const Component = () => {
  const [{ count }] = useStore(
    (state) => [{ count: state.count }]
  );
  return <div>count: {count}</div>;
};

As a result, the component will re-render, even if the count value is unchanged. This is a pitfall when we use selectors for render optimization.


In summary, the benefit of selector-based render optimization is that the behavior is fairly predictable because you explicitly write selector functions. However, the downside of selector-based render optimization is that it requires an understanding of object references.
 */