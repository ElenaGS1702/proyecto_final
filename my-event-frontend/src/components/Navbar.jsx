import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const hasRole = (...roles) => roles.includes(user?.role);
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="container-app py-4 flex items-center justify-between">
          <Link to="/events" className="text-xl font-semibold">
            {import.meta.env.VITE_APP_NAME || "App"}
          </Link>

          <nav className="hidden md:flex items-center gap-3">
            <Link to="/events" className="btn">
              Eventos
            </Link>

            {isAuthenticated() && hasRole("organizer", "admin") && (
              <Link to="/events/new" className="btn btn-primary">
                Crear evento
              </Link>
            )}

            {isAuthenticated() && hasRole("organizer", "staff", "admin") && (
              <Link to="/scan" className="btn btn-primary">
                Escanear
              </Link>
            )}

            {isAuthenticated() ? (
              <>
                <span className="text-sm opacity-80">
                  Hola, {user?.name || user?.email}
                </span>
                <button
                  className="btn"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link className="btn" to="/">
                  Login
                </Link>
                <Link className="btn btn-primary" to="/register">
                  Registro
                </Link>
              </>
            )}
          </nav>
          {/* menu hamburguesa */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? (
              <img
                src="/icons/close.png"
                alt="Cerrar menú"
                className="w-7 h-7"
              />
            ) : (
              <img src="/icons/menu.png" alt="Abrir menú" className="w-7 h-7" />
            )}
          </button>
        </div>
      </header>
      
      {/* menu para moviles */}
      {open && (
        <nav className="header md:hidden flex flex-col px-4 py-3 space-y-3">
          <a
            href="/"
            className="hover:text-gray-300 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              navigate("/events");
            }}
          >
            Eventos
          </a>
          {isAuthenticated() && hasRole("organizer", "admin") && (
            <a
              href="/"
              className="hover:text-gray-300 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                navigate("/events/new");
              }}
            >
              Crear evento
            </a>
          )}
          {isAuthenticated() && hasRole("organizer", "staff", "admin") && (
            <a
              href="/"
              className="hover:text-gray-300 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                navigate("/scan");
              }}
            >
              Escanear
            </a>
          )}

          {isAuthenticated() ? (
            <a
              href="/"
              className="hover:text-gray-300 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                logout();
                setOpen(false);
                navigate("/");
              }}
            >
              Salir
            </a>
          ) : (
            <>
              <a
                href="/"
                className="hover:text-gray-300 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  navigate("/");
                }}
              >
                Login
              </a>
              <a
                href="/"
                className="hover:text-gray-300 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  navigate("/register");
                }}
              >
                Registro
              </a>
            </>
          )}
        </nav>
      )}
    </>
  );
}
