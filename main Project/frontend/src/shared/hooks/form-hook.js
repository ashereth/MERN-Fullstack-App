import { useCallback, useReducer } from "react";


const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            //check all inputs and update formisvalid if all actions that changed are valid or not
            for (const inputId in state.inputs) {
                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: { value: action.value, isValid: action.isValid }
                },
                isValid: formIsValid
            };

        case 'SET_DATA':
            return {
                inputs: action.inputs,
                isValid: action.formIsValid
            }

        default:
            return state;
    }
};

const useForm = (initialInputs, initialFormValidity) => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity
    });

    //usecallback so that the function doesnt get remade everytime the page is reloaded
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({ type: 'INPUT_CHANGE', value: value, isValid: isValid, inputId: id })
    }, []);

    const setFormData = useCallback((inputData, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity
        })
    }, [])

    return [formState, inputHandler, setFormData];
}

export default useForm;