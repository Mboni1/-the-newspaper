import React from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { increment, decrement, reset } from "../store/CounterSlice";

const Counter: React.FC = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Redux Counter</h1>
      <p className="text-3xl mb-4">{count}</p>

      <div className="flex gap-3">
        <button
          onClick={() => dispatch(decrement())}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          -
        </button>
        <button
          onClick={() => dispatch(increment())}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          +
        </button>
      </div>

      <button
        onClick={() => dispatch(reset())}
        className="bg-gray-500 text-white px-3 py-1 rounded mt-2"
      >
        Reset
      </button>
    </div>
  );
};

export default Counter;
