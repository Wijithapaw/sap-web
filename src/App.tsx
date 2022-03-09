import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { Link, Route, Routes } from 'react-router-dom';
import { Login } from './features/auth/Login';

function App() {
  return (
    <div className="App">
      <header>
        <div>
          <h1>Bookkeeper</h1>
          <nav
            style={{
              borderBottom: "solid 1px",
              paddingBottom: "1rem",
            }}
          >
            <Link to="/login">Invoices</Link> |{" "}
            <Link to="/counter">Expenses</Link>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/counter" element={<Counter/>}/>
      </Routes>

    </div>
  );
}

export default App;
