import React, { Component } from 'react';
import {Link} from 'react-router-dom'

class Admin extends Component {
 render() {
 return (
    <div>
       <p>
            Exemplo de Página Admin :)
       </p>
       <p>
           <Link to='/'> Voltar para a página principal </Link>
       </p>
    </div>
 );
 }
}
export default Admin;