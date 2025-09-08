// import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, useEffect } from 'react';
import Admin_Layout from './layout/admin_layout';
import User_Layout from './layout/user_layout';

const App = () => {
    useEffect(() => {
        if (window.google && window.google.accounts) {
            console.log('checkkkk: ', window.google.accounts.clientId);
        } else {
            console.log('google account chua load xong');
        }
    }, []);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BrowserRouter>
                <Switch>
                    <Route path="/admin" component={Admin_Layout} />

                    <Route path="/" component={User_Layout} />
                </Switch>
            </BrowserRouter>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                // transition={Bounce}
            />
        </Suspense>
    );
};

export default App;
