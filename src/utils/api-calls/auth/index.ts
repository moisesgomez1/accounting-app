/**
 * Sends a POST request to authenticate a user with the provided credentials.
 *
 * @param {AuthenticateRequest} data - The authentication request payload.
 * @returns {Promise<AuthenticateResponse>} A promise resolving to the authentication response.
 */

const authURL = process.env.AUTH_API_URL;

export interface AuthenticateRequest {
    email: string;
    password: string;
}

export interface AuthenticateResponse {
    error: boolean;
    message: string;
    data: UserData;
    token: string;
}

/**
 * Interface representing the user data returned upon successful authentication.
 */
export interface UserData {
    id: string;
    user_email: string;
    department: string;
    loopita_initials: string;
}


export function postAuthenticate(
    data: AuthenticateRequest
): Promise<AuthenticateResponse> {
    return fetch(`${authURL}/authenticate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(async (response) => {
            if (response.ok) {
                const result: AuthenticateResponse = await response.json();
                return result;
            } else {
                throw new Error(`Failed to authenticate: ${response.status}`);
            }
        })
        .catch((error) => {
            throw error;
        });
}