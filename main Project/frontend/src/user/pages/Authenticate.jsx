import React, { useState, useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import useForm from "../../shared/hooks/form-hook";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import './Auth.css';

const Authenticate = (props) => {
    const auth = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);
    //use the http custom hook
    const { isLoading, error, sendRequest, clearError } = useHttpClient();


    //keep track of formstate
    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                }
            }, false);
        }
        setIsLoginMode(prevMode => !prevMode);
    }

    //function that gets called whenever the button gets clicked
    const userAuthInputHandler = async (event) => {
        event.preventDefault();

        //if user is loging in
        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/login',
                    'POST',
                    JSON.stringify(
                        {
                            email: formState.inputs.email.value,
                            password: formState.inputs.password.value
                        }
                    ),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.user.id);
            } catch (err) {
                console.log(err);
            }
        } else {//if user is signing up
            try {
                //send a http request to the backend api for signup
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/signup',
                    'POST',
                    JSON.stringify(
                        {
                            name: formState.inputs.name.value,
                            email: formState.inputs.email.value,
                            password: formState.inputs.password.value
                        }
                    ),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.user.id);
            } catch (err) {
                console.log(err);

            }
        }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required</h2>
                <hr />
                <form onSubmit={userAuthInputHandler}>
                    {!isLoginMode && (
                        <Input
                            element='input'
                            id='name'
                            type='text'
                            label="Your Name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter your name"
                            onInput={inputHandler}
                        />
                    )}
                    <Input
                        id='email'
                        element='input'
                        type='email'
                        label='Email'
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email"
                        onInput={inputHandler}
                    />
                    <Input
                        id='password'
                        element='input'
                        type='password'
                        label='Password'
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password (at least 5 characters long)"
                        onInput={inputHandler}
                    />
                    <Button type='submit' disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}</Button>
            </Card>
        </React.Fragment>

    )
}

export default Authenticate;