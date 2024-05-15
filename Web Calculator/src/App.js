import "./styles.css"
import DigitButton from "./DigitButton";
import OperationButton from "./OperationsButton";
import {useReducer} from "react"

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  SELECT_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOper: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOper === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOper.includes(".")) {
        return state
      }

      return { 
        ...state, 
        currentOper: `${state.currentOper || ""}${payload.digit}`,
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.SELECT_OPERATION:
      if (state.currentOper === null && state.prevOper === null) {
        return state;
      }
    
      if (state.currentOper !== null) {
        if (state.prevOper !== null && state.operation) {
          // If both operands and an operation already exist, calculate result first
          return {
            ...state,
            prevOper: evaluate(state),
            operation: payload.operation,
            currentOper: null,
          };
        } else {
          // No calculation needed, just transition currentOper to prevOper
          return {
            ...state,
            operation: payload.operation,
            prevOper: state.currentOper,
            currentOper: null,
          };
        }
      }
    
      // If currentOper is null but there is a previous operation and operand
      return {
        ...state,
        operation: payload.operation,
      };
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOper == null || state.prevOper == null) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        prevOper: null,
        currentOper: evaluate(state),
        operation: null,
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOper: null,
        }
      }
      
      if (state.currentOper == null) {
        return state
      }

      if (state.currentOper.length === 1) {
        return {
          ...state,
          currentOper: null,
        }
      }

      return {
        ...state,
        currentOper: state.currentOper.slice(0, -1)
      }
  }
}

function evaluate({currentOper, prevOper, operation}) {
  const prev = parseFloat(prevOper)
  const curr = parseFloat(currentOper)
  if (isNaN(prev) || isNaN(curr)) {
    return ""
  }

  let computation = ""
  switch(operation) {
    case "+":
      computation = prev + curr
      break
    case "-":
      computation = prev - curr
      break
    case "*":
      computation = prev * curr
      break
    case "÷":
      computation = prev / curr
      break
  }
  return computation.toString()
}

const INT_FORMAT = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return 
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INT_FORMAT.format(integer)
  return `${INT_FORMAT.format(integer)}.${decimal}`
}


function App() {
  const [{ currentOper, prevOper, operation }, dispatch] = useReducer(reducer, {});
  return (
    <div className="calc-grid">
        <div className="output">
            <div className="prev-out">{formatOperand(prevOper)} {operation}</div>
            <div className="curr-out">{formatOperand(currentOper)}</div>
        </div>
        <button className="two-space" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
        <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch}/>
        <DigitButton digit="1" dispatch={dispatch}/>
        <DigitButton digit="2" dispatch={dispatch}/>
        <DigitButton digit="3" dispatch={dispatch}/>
        <OperationButton operation="*" dispatch={dispatch}/>
        <DigitButton digit="4" dispatch={dispatch}/>
        <DigitButton digit="5" dispatch={dispatch}/>
        <DigitButton digit="6" dispatch={dispatch}/>
        <OperationButton operation="+" dispatch={dispatch}/>
        <DigitButton digit="7" dispatch={dispatch}/>
        <DigitButton digit="8" dispatch={dispatch}/>
        <DigitButton digit="9" dispatch={dispatch}/>
        <OperationButton operation="-" dispatch={dispatch}/>
        <DigitButton digit="." dispatch={dispatch}/>
        <DigitButton digit="0" dispatch={dispatch}/>
        <button className="two-space" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
