import { StoreState, useStore } from "./store";

const selectCount2 = (state: StoreState) => state.count2;
const selectInc2 = (state: StoreState) => state.inc2;

export const Counter2 = () => {
  const count2 = useStore(selectCount2);
  const inc2 = useStore(selectInc2);
  return (
    <div>
      count2: {count2} <button onClick={inc2}>+1</button>
    </div>
  );
};