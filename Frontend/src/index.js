import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { Provider } from 'react-redux';
// import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import i18n from './utils/i18n';
import { I18nextProvider } from 'react-i18next';
import { store, persistor } from './redux/store';
// import { I18nextProvider } from 'react-i18next';

require('dotenv').config();

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <I18nextProvider i18n={i18n}>
                    <App />
                </I18nextProvider>
            </PersistGate>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
