import {ACTIONS} from "./App.js"

export default function OperationButton({dispatch, operation}) {
    return (
        <button onClick={() => dispatch({ type: ACTIONS.SELECT_OPERATION, payload: { operation } })}>
            {operation}
        </button>
    );
}
