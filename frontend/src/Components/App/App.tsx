import { useNavigate } from 'react-router';

import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { auth0Audience, auth0ClientId, auth0Domain } from '../../library/auth0Config';
import { AppContent } from './AppContent';

export const App = () => {
    const navigate = useNavigate();

    const onRedirectCallback = (appState?: AppState) => {
        navigate(appState?.returnTo ?? window.location.pathname);
    };

    return (
        <Auth0Provider
            domain={auth0Domain}
            clientId={auth0ClientId}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: auth0Audience,
            }}
            onRedirectCallback={onRedirectCallback}
        >
            <AppContent />
        </Auth0Provider>
    );
}

export default App;