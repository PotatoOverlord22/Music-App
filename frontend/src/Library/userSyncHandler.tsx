import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import React from "react";
import { BACKEND_URL } from "./constants";
import { auth0Audience } from "./auth0Config";

export const UserSyncHandler = () => {
    const { isAuthenticated, user, getAccessTokenSilently, isLoading } = useAuth0();

    React.useEffect(() => {
        const syncUser = async () => {
            if (!isAuthenticated) {
                return;
            }

            if (!user) {
                return;
            }

            if (isLoading) {
                return;
            }

            try {
                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: auth0Audience,
                    },
                });

                console.log('Access Token obtained for sync:', token ? 'Yes' : 'No');

                await axios.post(`${BACKEND_URL}/api/User/Sync`,
                    {
                        auth0Id: user.sub,
                        email: user.email,
                        name: user.name,
                        picture: user.picture,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    }
                );
                console.log('User synced successfully with backend!');
            } catch (error) {
                console.error('Failed to sync user with backend:', error);
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    console.warn('Unauthorized: Token might be expired or invalid. User might need to re-authenticate.');
                }
            }
        };

        syncUser();
    }, [isAuthenticated, user, getAccessTokenSilently, isLoading]);

    return null;
};