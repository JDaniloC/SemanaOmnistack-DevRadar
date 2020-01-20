import React, { Component, useEffect } from 'react';
import { Link } from 'react-router-dom'
import './Estilos/pagina404.css'

class Admin extends Component {
    useEffect(() => {
        document.title = 'Page not found'
    }, [])
 render() {
 return (
     <>
        <div className="bloco">
            <h1> 404 </h1>
            <p> Acho que você se perdeu </p>
        </div>
        <p> Para voltar à página principal clique na imagem abaixo: </p>
        <Link to = '/'> Aqui </Link>
     </>
 );
 }
}
export default Admin;