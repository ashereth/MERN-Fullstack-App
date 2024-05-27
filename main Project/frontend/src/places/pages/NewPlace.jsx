import React from "react";

import Input from "../../shared/components/FormElements/Input";
import './PlaceForm.css';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import useForm from '../../shared/hooks/form-hook';


const NewPlace = () => {
    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        }
    }, false);

    const placeSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);//will be sent to backend
    };

    return (
        <form className="place-form" onSubmit={placeSubmitHandler}>
            <Input
                id="title"
                type="text"
                label="Title"
                element="input"
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please Enter A Valid Title.'
                onInput={inputHandler}
            />
            <Input
                id='description'
                label="Description"
                element="textarea"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText='Please Enter A Valid Description (at least 5 characters).'
                onInput={inputHandler}
            />
            <Input
                id='address'
                label="Address"
                element="input"
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please Enter A Valid Address.'
                onInput={inputHandler}
            />

            <Button type='submit' disabled={!formState.isValid} >
                ADD PLACE
            </Button>
        </form>
    )
};

export default NewPlace;