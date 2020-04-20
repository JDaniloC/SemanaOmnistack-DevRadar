import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import './Estilos/pagina404.css'

function Pagina404 (){
    useEffect(() => {
        document.title = 'Page not found'
    }, [])
    
    return (
        <>
            <div id="notfound">
                <div class="notfound">
                    <div class="notfound-404">
                        <h1>404</h1>
                    </div>
                    <h2>Oops! Esta página não pôde ser encontrada</h2>
                    <p>Desculpe mas essa página que vocês está procurando não existe, foi removida, o caminho foi mudado ou qualquer coisa do tipo</p>
                    <Link to = '/'> Ir para a página inicial </Link>
                </div>
            </div>
        </>
    );
}
export default Pagina404;