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

/**
 * Returns the human-readable name for a given user id
 * @param {string} userId The id of the user whose names should be returned.
 * @returns {object} A user object containing the _id, firstName, and lastName properties.
 */
const getUserName = async (userId) => {
    const userName = await fetch(`${baseURL}/user/name`, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "id": userId
        })
    }).then(response => response.json());
    return userName;
}

/**
 * Updates the given shift by id and returns an updated shift object.
 * @param {string} shiftId The id of the shift to update.
 * @param {json} body The key value pairs of fields to be updated in the shift object.
 */
const updateShift = async (shiftId, body) => {
    const updatedShift = await fetch(`${baseURL}/shift/${shiftId}`, {
        credentials: "include",
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(response => response.json());
    return updatedShift;
}

export {
    getClient,
    getCarers,
    getAllShifts,
    getUserName,
    updateShift,
}