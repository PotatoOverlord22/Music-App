import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import axios from "axios";
import React, { JSX } from "react";
import { BACKEND_URL } from "../../Library/constants";
import { PageContent } from "../PageContent/pageContent";
import { LoadingIndicator } from "../PageContent/pageContent.styles";
import { AuthenticationGuardProps } from "./authenticationGuard.types";

export const AuthenticationGuard = (props: AuthenticationGuardProps): JSX.Element => {
    const { user, getAccessTokenSilently } = useAuth0();

    React.useEffect((): void => {
        const syncUser = async (): Promise<void> => {
            if (!user) return;

            try {
                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE
                    }
                });

                await axios.post(`${BACKEND_URL}/api/User/Sync`,
                    {
                        auth0Id: user?.sub,
                        email: user?.email,
                        name: user?.name,
                        picture: user?.picture,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
            }
            catch (error) {
                console.error('Failed to sync user with database', error);
            }
        };

        syncUser();
    }, [user, getAccessTokenSilently]);

    const Component = withAuthenticationRequired(() => (
        <PageContent>
            <props.component />
        </PageContent>
    ), {
        onRedirecting: () => (
            <LoadingIndicator />
        ),
    });

    return (
        <Component />
    );
};