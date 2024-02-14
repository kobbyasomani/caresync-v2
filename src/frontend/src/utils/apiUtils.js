import baseURL from "./baseUrl";

/**
 * Returns a client object using a given client id
 * @param {string} clientId The id of the client to return.
 * @returns 
 */
const getClient = async (clientId) => {
    const client = await fetch(`${baseURL}/client/${clientId}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => response.json())
        .then(data => data.client)
    return client;
};

/**
 * Gets the carers for a given client by client id
 * @param {string} clientId The id of the client whose carers are being retrieved.
 * @returns {array} An array of carer objects contaning the carer `_id`, 
 * `firstName`, and `lastName` properties.
 */
const getCarers = async (clientId) => {
    const carers = getClient(clientId).then(client => client.carers);
    return carers
};

/**
 * Gets all shifts for a given client by client id
 * @param {string} clientId The id of the client whose shifts are being retrieved.
 * @returns {array} An array of shift objects.
 */
const getAllShifts = async (clientId) => {
    const shifts = await fetch(`${baseURL}/shift/${clientId}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(response => response.json())
    return shifts
};

export {
    getClient,
    getCarers,
    getAllShifts,
}