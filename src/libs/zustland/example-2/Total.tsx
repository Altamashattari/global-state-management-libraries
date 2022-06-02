import { StoreState, useStore } from "./store";

const selectCount1 = (state: StoreState) => state.count1;
const selectCount2 = (state: StoreState) => state.count2;

// create a derived state? 

const selectTotal = (state: StoreState) => state.count1 + state.count2;


export const Total = () => {
    // // This is a valid pattern and it can stay as-is. There is an edge case where extra re-renders happen, which is when count1 is increased and count2 is decreased by the same amount. The total number won't change, but it will re-render. To avoid this, we can use a selector function for the derived state.
    // const count1 = useStore(selectCount1);
    // const count2 = useStore(selectCount2);

    // This will only re-render when the total number is changed.
    const total = useStore(selectTotal);
    return (
      <div>
        {/* total: {count1 + count2} */}
        total: {total}
      </div>
    );
  };