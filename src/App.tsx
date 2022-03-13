import React, { useEffect } from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './features/auth/components/Login';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { authInitialize, logout, selectAuthUser } from './features/auth/auth-slice';

function App() {
  const user = useAppSelector(selectAuthUser);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  }

  useEffect(() => {
    dispatch(authInitialize());
  }, [])

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">SAP</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

              <li className="nav-item"><Link className="nav-link active" to="/counter">Counter</Link></li>
              {
                user ? <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    {user.email}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
                  </ul>
                </li> : <li className="nav-item"><Link className="nav-link active" to="/login">Login</Link></li>
              }
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/counter" element={<Counter />} />
          <Route path="/"  element={<Navigate to="/counter" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
