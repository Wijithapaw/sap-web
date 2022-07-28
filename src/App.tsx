import React, { useEffect } from 'react';
import './App.css';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './features/auth/components/Login';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { authInitialize, logout, selectAuthUser } from './features/auth/auth-slice';
import PrivateRoute from './components/PrivateRoute';
import AuthGuard from './components/AuthGuard';
import { SapPermissions } from './app/constants';
import TransactionEntryPage from './features/finance/components/TransactionEntryPage';
import { fetchExpenseTypesAsync, fetchIncomeTypesAsync, fetchProjectsAsync } from './features/finance/finance-slice';
import TransactionPage from './features/finance/components/TransactionPage';
import UserProfilePage from './features/auth/components/UserProfilePage';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import GlobalError from './components/GlobalError';
import { isMobileSelector, setAppInitialized, setIsMobile } from './app/core-slice';
import AdminPage from './features/admin/components/AdminPage';
import WorkLogsPage from './features/worklog/components/WorkLogsPage';
import SapToast from './components/SapToast';

import 'react-bootstrap-typeahead/css/Typeahead.css';

library.add(fas);

function App() {
  const user = useAppSelector(selectAuthUser);
  const authInitialized = useAppSelector((state) => state.auth.initialized);
  const appInitialized = useAppSelector((state) => state.core.appInitialized);
  const isMobile = useAppSelector(isMobileSelector);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  }

  const loadCommonData = () => {
    dispatch(fetchProjectsAsync());
    dispatch(fetchIncomeTypesAsync());
    dispatch(fetchExpenseTypesAsync());
  }

  useEffect(() => {
    dispatch(authInitialize());

    const isMobile = detectMobile();
    dispatch(setIsMobile(isMobile));
  }, [])

  useEffect(() => {
    if (authInitialized && isMobile !== undefined)
      dispatch(setAppInitialized(true));
  }, [authInitialize, isMobile])

  function detectMobile() {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
  }

  useEffect(() => {
    authInitialized && user && loadCommonData();
  }, [authInitialized, user])

  if (!appInitialized) return null;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className='navbar-brand' to="/login">SAP</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <AuthGuard>
                <li className="nav-item"><Link className="nav-link active" to="/data-entry">Data Entry</Link></li>
              </AuthGuard>
              <AuthGuard permission={SapPermissions.financialReports}>
                <li className="nav-item"><Link className="nav-link active" to="/reports">Reports</Link></li>
              </AuthGuard>
              <li className="nav-item"><Link className="nav-link active" to="/work-log">Work Log</Link></li>
              <AuthGuard permission={SapPermissions.adminControl}>
                <li className="nav-item"><Link className="nav-link active" to="/admin">Admin</Link></li>
              </AuthGuard>
              {
                user ? <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    {user.givenName}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><Link className="dropdown-item" to="/user/profile">Profile</Link> </li>
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
          <Route path="/data-entry" element={<PrivateRoute><TransactionEntryPage /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute permission={SapPermissions.financialReports}><TransactionPage /></PrivateRoute>} />
          <Route path="/user/profile" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="/work-log" element={<PrivateRoute><WorkLogsPage /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/data-entry" />} />
        </Routes>
      </div>
      <GlobalError />
      <SapToast />
    </>
  );
}

export default App;
