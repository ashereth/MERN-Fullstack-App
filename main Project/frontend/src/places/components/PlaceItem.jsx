import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import './PlaceItem.css';
import { AuthContext } from "../../shared/context/auth-context";
import Button from '../../shared/components/FormElements/Button';
import Map from "../../shared/components/UIElements/Map";
import Modal from "../../shared/components/UIElements/Modal";

const PlaceItem = props => {
    const auth = useContext(AuthContext);
    //state for whether or not to show the map modal
    const [showMap, setShowMap] = useState(false);
    //state for whether or not to show deletion modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const openMapHandler = () => {
        setShowMap(true);
    }

    const closemapHandler = () => {
        setShowMap(false);
    }

    const showDeletWarningHandler = () => {
        setShowConfirmModal(true);
    }

    const cancelDeletHandler = () => {
        setShowConfirmModal(false);
    }

    const confirmDeleteHandler = () => {
        setShowConfirmModal(false);
        console.log("deleting ...")
    }

    return (

        <React.Fragment>
            <Modal
                show={showMap}
                onCancel={closemapHandler}
                header={props.address}
                content="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closemapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map coordinates={props.coordinates} style={{ height: '100%' }} />
                </div>
            </ Modal>
            <Modal
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                show={showConfirmModal}
                onCancel={cancelDeletHandler}
                footer={
                    <React.Fragment>
                        <Button inverse onClick={cancelDeletHandler}>Cancel</Button>
                        <Button danger onClick={confirmDeleteHandler}>Delete</Button>
                    </React.Fragment>
                }>
                <p>Are you sure you want to delete this place? This action cannot be undone.</p>
            </Modal>
            <li className="place-item">
                <Card className="place-item__content">
                    <div className="place-item__image">
                        <img src={props.image} alt={props.title} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="palce-item__actions">
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        {auth.isLoggedIn && <Button to={`/places/${props.id}`}>EDIT</Button>}
                        {auth.isLoggedIn && <Button danger onClick={showDeletWarningHandler}>DELETE</Button>}
                        
                    </div>
                </Card>
            </li>
        </React.Fragment >


    )
};

export default PlaceItem;