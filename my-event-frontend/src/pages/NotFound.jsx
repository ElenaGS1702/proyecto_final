import { Link } from "react-router-dom";

export default function NotFound(){
    return (
        <div className="text-center py-20">
            <h1 className="text-3xl font-semibold mb-2">Página no encontrada</h1>
            <p className="opacity-80 mb-6" >La ruta que intentas abrir no existe o fue removida.</p>
            <Link className="btn btn-primary" to='/'>Volver al inicio</Link>
        </div>
    )
}