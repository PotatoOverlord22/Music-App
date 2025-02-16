import { FluentProvider } from '@fluentui/react-components';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App/App';
import './index.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <FluentProvider>
            <App />
        </FluentProvider>
    </React.StrictMode>
);