import React from "react";

import UserItem from "./UserItem";
import './UsersList.css';
import Card from "../../shared/components/UIElements/Card";


const UsersList = (props) => {
    if (props.items.length === 0) {//if there are no users passed
        return (<div className="center">
            <Card>
                <h2>No users found</h2>
            </Card>
            
        </div>)
    }

    

    return <ul className="users-list">
        {props.items.map((user) => {
            console.log(user);
            return <UserItem
                key={user.id}
                id={user.id}
                image={user.image}
                name={user.name}
                placeCount={user.places.length} />
        })}
    </ul>
};

export default UsersList;