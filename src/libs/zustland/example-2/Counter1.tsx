import { StoreState, useStore } from "./store";

const selectCount1 = (state: StoreState) => state.count1;

export const Counter1 = () => {
    const count1 = useStore(selectCount1);
    const inc1 = () => {
        useStore.setState(
            (prev) => ({ count1: prev.count1 + 1 })
        );
    };
    return (
        <div>
        count1: { count1 } <button onClick={ inc1 }> +1 </button>
        </div>
  );
};