import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Users = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    //keep track of users
    const [loadedUsers, setLoadedUsers] = useState();

    //dont use async in useEffect instead create an async function within useEffect
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                //get users using a get request with custom hook
                const responseData = await sendRequest('http://localhost:5000/api/users');

                setLoadedUsers(responseData.users);
            } catch (err) {
                console.log(err.message)
            }
        }
        fetchUsers();

    }, [sendRequest])


    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
        </React.Fragment>

    );
}

export default Users;