import baseURL from "./baseUrl";

/**
 * Gets the carers for a given patient by patient id
 * @param {string} patientId The id of the patient whose carers are being retrieved.
 * @returns {array} An array of carer objects contaning the carer `_id`, 
 * `firstName`, and `lastName` properties.
 */
const getCarers = async (patientId) => {
    const carers = await fetch(`${baseURL}/patient/${patientId}`, {
        credentials: "include"
    }).then((response => response.json()))
        .then(data => data.patient.carers)
    return carers
}

/**
 * Gets all shifts for a given patient by patient id
 * @param {string} patientId The id of the patient whose shifts are being retrieved.
 * @returns {array} An array of shift objects.
 */
const getAllShifts = async (patientId) => {
    const shifts = await fetch(`${baseURL}/shift/${patientId}`, {
        credentials: "include"
    }).then(response => response.json())
    return shifts
}

export {
    getCarers,
    getAllShifts
}