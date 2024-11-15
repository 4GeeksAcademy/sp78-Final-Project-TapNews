import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Card, ListGroup, Modal, Button, Row, Col } from "react-bootstrap";
import "../../styles/cardfriend.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faComments } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import TapNewsLogo from '/workspaces/sp78-Final-Project-TapNews/public/1729329195515-removebg-preview.png';

const FriendCard = () => {
  const { store, actions } = useContext(Context);
  const [show, setShow] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);  // Para almacenar el ID del amigo seleccionado
  const userId = localStorage.getItem("user_id");

  const handleClose = () => setShow(false);
  const handleShow = (friendId) => {
    setSelectedFriendId(friendId);  // Guardamos el ID del amigo que se va a eliminar
    setShow(true);
  };

  useEffect(() => {
    actions.getFriends(userId);
    actions.getAllUsers();
    actions.getAllProfiles();
  }, []);




  if (!store.friends.length || !store.listuser.length) {
    return <div className="loading"><img className="logo-2" src={TapNewsLogo} /></div>;
  }

  const friendsWithProfiles = store.friends.map(friend => {
    const user = store.listuser.find(user => Number(user.id) === Number(friend.friend_id));
    const profile = store.listprofile.find(profile => Number(profile.user_id) === Number(friend.friend_id));

    return {
      ...user,
      profile: profile || {}  // Asegúrate de que no sea null o undefined
    };
  });

  console.log("Amigos con sus perfiles:", friendsWithProfiles);

  return (
    <>
      {friendsWithProfiles.map((friend, index) => {
         const key = `${friend.id}-${friend.friend_id}-${index}`
        return (
          <Card key={key} className="friendcard" style={{ width: '100%', height: '10rem' }}>
            <Row className="row d-flex justify-content-center pt-4">
              <Col className="col-4">
                <Card.Img className="friendimage" variant="top" src={friend.profile.img_url || 'default-image-url'} />
              </Col>
              <Col className="col-4">
                <Card.Title className="frienduser">{friend.username}</Card.Title>
              </Col>
              <Col className="col-3 d-flex flex-column">
                <Link className="mx-auto" to={`/friends/${friend.id}`}>
                  <FontAwesomeIcon className="pb-2" icon={faCircleUser} size="2xl" style={{ color: "#ffffff" }} />
                </Link>
                <FontAwesomeIcon className="pb-2" icon={faComments} size="2xl" style={{ color: "#ffffff" }} />
                <FontAwesomeIcon className="pb-2" onClick={() => handleShow(friend.id)} icon={faCircleXmark} size="2xl" style={{ color: "#ffffff" }} />
              </Col>
            </Row>
          </Card>
        );
      })}
      
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title className="text-title">Borrar amistad</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-modal">¿Seguro que quieres eliminar esta amistad?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button className="delete" onClick={() => { 
              useEffect(() => {
                actions.deleteFriend(userId, selectedFriendId);
              }, []);
            handleClose(); 
          }}>
            Eliminar definitivamente
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { FriendCard };