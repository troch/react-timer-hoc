# React timer component (higher-order)

> A React higher-order timer component

Keep your components simple, testable and composable by using higher-order components.
This higher-order timer component will re-render your component at the desire rate (in milliseconds).

__Demo__: http://jsbin.com/nalixa/edit?html,js,output

### Applications

- Countdowns (time remaining)
- Timers (time elapsed)
- Forcing updates / refresh of time-based contents

### Installation

```sh
npm install --save react-timer-hoc
```

### Usage

Create a new component by wrapping your component with `timer` HOC. Alongside the properties you specify, the created component will receive a `tick` property, the specified `delay` value and a `stop` function.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

function myComponent({ tick, cancel, delay }) {
    return <div>Started { tick * delay }ms ago.</div>
}

const Timer1 = timer(1000)(myComponent);
const Timer2 = timer(2000)(myComponent);

ReactDOM.render(
    <div>
        <Timer1 />
        <Timer2 />
    </div>,
    document.getElementById('app')
);
```
