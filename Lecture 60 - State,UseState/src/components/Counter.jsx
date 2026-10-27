import React, { useState } from 'react'

function Counter(props) {

    let [value,setValue]=useState(0);
    let count = 0;
    // "useState()" //Manages State --> State means Internal data of component , generally an object,returns fixxed length array,
    // 1. call hooks on top lvl of components
    // Hooks are function used using "Use"
    // 2. call hooks inside react-components or custom hooks

    function increment(){
        // setValue(value++);
        setValue((prev)=>prev+1)
    }
    function decrement(){
      setValue((prev)=>prev-1)
    }
    return (
    <div>
        <h1>Counter</h1>
        <button onClick={increment}>+</button>
        <p>{value}</p>
<button onClick={decrement}>-</button>

        </div>
  )
}

export default Counter;