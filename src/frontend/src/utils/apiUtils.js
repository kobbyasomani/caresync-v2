import { baseURL_API } from "./baseURL";

/**
 * Returns a client object using a given client id. Includes the client's
 * `_id`, `firstName`, `lastName`, `isCoordinator` (boolean), coordinator: { _id, firstName, lastName }` and
 * `carers: [{ _id, firstName, lastName }]`.
 * @param {String}clientId The id of the client to return.
 * @returns {Object}
 */
const getClient = async (clientId) => {
    const client = await fetch(`${baseURL_API}/client/${clientId}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => response.json());
    return client;
};

/**
 * Gets the carers for a given client by client id
 * @param {String} clientId The id of the client whose carers are being retrieved.
 * @returns {Array<Object>} An array of carer objects contaning the carer `_id`, 
 * `firstName`, and `lastName` properties.
 */
const getCarers = async (clientId) => {
    const carers = getClient(clientId).then(client => client.carers);
    return carers
};

/**
 * Gets all shifts for a given client by client id
 * @param {String}clientId The id of the client whose shifts are being retrieved.
 * @returns {Array<Object>} An array of shift objects.
 */
const getAllShifts = async (clientId) => {
    const shifts = await fetch(`${baseURL_API}/shift/${clientId}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(response => response.json())
    return shifts
};

/**
 * Returns the human-readable name for a given user id
 * @param {String}userId The id of the user whose names should be returned.
 * @returns {Object} A user object containing the _id, firstName, and lastName properties.
 */
const getUserName = async (userId) => {
    const userName = await fetch(`${baseURL_API}/user/name`, {
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
};

/**
 * Returns all user fields except the password for the current user.
 * @param {String} userId The id of the user whose account information should be retrieved.
 * @returns {Object} An object containing the _id, firstName, lastName, email, and isConfirmed fields. 
 */
const getUser = async () => {
    const user = await fetch(`${baseURL_API}/user/my-account`, {
        credentials: "include",
    }).then(response => {
        if (response.status !== 200) {
            throw new Error("Your account details could not be fetched at this time.");
        } else {
            return response.json()
        }
    });
    return user;
};

/**
 * Updates the given user fields for the current user.
 * @param {Object} fields The key value pairs of user fields to update. Only firstName, lasName,
 * email, and password are valid fields.
 * @returns {Object} An object containing the updated _id, firstName, lastName, email, and isConfirmed fields. 
 */
const updateUser = async (fields) => {
    const user = await fetch(`${baseURL_API}/user/my-account`, {
        credentials: "include",
        method: "PUT",
        body: JSON.stringify(fields)
    }).then(response => {
        if (response.status !== 200) {
            throw new Error("Your account could not be updated at this time.");
        } else {
            return response.json()
        }
    });
    return user;
};

/**
 * Updates the given shift by id and returns an updated shift object.
 * @param {String}shiftID The id of the shift to update.
 * @param {json}body The key value pairs of fields to be updated in the shift object.
 */
const updateShift = async (shiftID, body) => {
    const updatedShift = await fetch(`${baseURL_API}/shift/${shiftID}`, {
        credentials: "include",
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(response => response.json());
    return updatedShift;
};

/**
 * Deletes the given incident report from the given shift.
 * @param {String}shiftID The id of the shift with the attached incident report
 * @param {String}incidentId The id of the incident report to delete
 */
const deleteIncidentReport = async (shiftID, incidentId) => {
    let error = null;
    const response = await fetch(`${baseURL_API}/shift/reports/${shiftID}`, {
        credentials: "include",
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            incidentId: incidentId
        })
    }).then(response => {
        if (response.status !== 200) {
            error = true;
        }
        return response.json();
    });
    // console.log(response);
    // console.log("Error:", error);
    if (error) {
        throw new Error(response.message);
    } else {
        const updatedShift = response;
        return updatedShift;
    }
};

export {
    getClient,
    getCarers,
    getAllShifts,
    getUserName,
    getUser,
    updateUser,
    updateShift,
    deleteIncidentReport
}