import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useAuth } from "../store/AuthContext";


import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import usuario from "/workspaces/sp78-Final-Project-TapNews/public/usuario.png"


export const LogIn = () => {
  const { user, handleUserLogin } = useAuth();
  const { actions } = useContext(Context);

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate()

  // METI LA INFO DE EMAIL Y PASS EN UN OBJETO
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setCredentials({ ...credentials, [name]: value });//ponemos name en corchetes bc is a dynamic variable, it means that the name will use as the email and the password
    console.log(credentials)
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    //Buscar al usuario registrado en el actions
    if (credentials.email && credentials.password) {
      try {
        await actions.login(credentials.email, credentials.password)
          .then(() => {
            navigate("/")
          })
      }
      catch (e) {
        setErrorMessage(e.message)
      }
    }

  };

  //AQUI MEZCLE LAS DOS FUNCONES EN UNA
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from submitting and refreshing the page
    handleLogin(e); // Call your first function
    //handleUserLogin(e, credentials); // Call the second function with event and credentials
  };

  return (
    <div className="text-center container mt-5">
      <div className="full-screen-container">
        <div className="form-container">
          <Form onSubmit={handleSubmit}>
            <img src={usuario} style={{ height: "250px", width: "auto" }} />
            <h1 className="my-5">Acceso de Usuario</h1>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Ingresar email"
                value={credentials.email}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Ingresar Contraseña"
                value={credentials.password}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Acceder
            </Button>
          </Form>
        </div>
        <Link to="/signup" className="link">
          Acceso a Registro
        </Link>
      </div>
    </div>
  );
};
