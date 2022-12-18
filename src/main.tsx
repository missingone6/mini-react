// import React from "react";
// import ReactDOM from "react-dom";
// import {  useReducer } from "react";
import {
  ReactDOM,
  Component,
  useReducer,
  useState,
  // useEffect,
  // useLayoutEffect,
} from "../which-react";

// import "./index.css";

function FunctionComponent() {
  // const [count, setCount] = useReducer((x: any) => x + 1, 0);
  const [count1, setCount1] = useState(1);
  // const [count2, setCount2] = useState(0);

  // useEffect(() => {
  //   console.log("omg useEffect", count2); //sy-log
  // }, [count2]);

  // useLayoutEffect(() => {
  //   console.log("omg useLayoutEffect", count2); //sy-log
  // }, [count2]);

  return (
    <div className="border">
      <p onClick={() => setCount1(count1 + 1)}>{count1}</p>
      {/* {count1 % 2 ? <span>111</span> : <div>222</div>} */}
      <ul>
        {
          count1 % 2 === 0
            ? [1,3,4].map((value, index) => {
              return <li key={value}>{value}</li>
            })
            : [1, 2, 3, 4].map((value, index) => {
              return <li key={value}>{value}</li>
            })
        }
      </ul>

    </div>
  );
  //       <button onClick={() => setCount()}>{count}</button>
  //     <button
  //       onClick={() => {
  //         setCount2(count2 + 1);
  //       }}>
  //       {count2}
  //     </button>

  //     {count % 2 ? <div>omg</div> : <span>123</span>}

  //     <ul>
  //       {/* {count2 === 2
  //         ? [0, 1, 3, 4].map((item) => {
  //             return <li key={item}>{item}</li>;
  //           })
  //         : [0, 1, 2, 3, 4].map((item) => {
  //             return <li key={item}>{item}</li>;
  //           })} */}

  //           {count2 === 2
  //             ? [2, 1, 3, 4].map((item) => {
  //                 return <li key={item}>{item}</li>;
  //               })
  //             : [0, 1, 2, 3, 4].map((item) => {
  //                 return <li key={item}>{item}</li>;
  //               })}
  //         </ul> 
}

class ClassComponent extends Component {

  render() {
    return (
      <div className="border">
        <h3>{this.props.name}</h3>
        我是文本
      </div>
    );
  }
}

function FragmentComponent() {
  return (
    <ul>
      <>
        <li>part1</li>
        <li>part2</li>
      </>
    </ul>
  );
}
function FunctionComponent2() {
  return (
    <div className="border">
      <p>fn22</p>
    </div>
  );
}
const jsx = (
  <div className="border">
    {/* <h1>react</h1> */}
    {/*<a href="https://github.com/bubucuo/mini-react">mini react</a> */}
    <FunctionComponent />
    {/* <FunctionComponent /> */}
    {/* <ClassComponent name="类组件" /> */}
    {/* <FragmentComponent /> */}
  </div>
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(jsx);
