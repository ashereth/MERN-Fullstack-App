import React, { useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import './PlaceItem.css';
import Button from '../../shared/components/FormElements/Button';
import Map from "../../shared/components/UIElements/Map";
import Modal from "../../shared/components/UIElements/Modal";

const PlaceItem = props => {
    const [showMap, setShowMap] = useState(false);

    const openMapHandler = () => {
        setShowMap(true);
    }

    const closemapHandler = () => {
        setShowMap(false);
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
                    <Map coordinates={props.coordinates} style={{height: '100%'}}/>
                </div>
            </ Modal>
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
                        <Button to={`/places/${props.id}`}>EDIT</Button>
                        <Button danger >DELETE</Button>
                    </div>
                </Card>

            </li>
        </React.Fragment >


    )
};

export default PlaceItem;