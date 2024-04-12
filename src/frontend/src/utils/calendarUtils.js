/**
 * Takes an array of shift objects and returns all shifts that are before the current time.
 * @param {Array<object>} shifts An array of shift objects to search for previous shifts.
 * The shifts must have a `shiftStartTime` property in a format that can be converted into
 * a JavaScript `Date` object. 
 * @returns {Array<object>}
 */
const findPreviousShifts = (shifts) => {
    const now = new Date();
    return shifts.filter(shift => new Date(shift.shiftStartTime) < now);
}

/**
 * Takes an array of shift objects and returns the first in-progress shift it finds based on the current time.
 * @param {Array<object>} shifts The array of shift objects to search for an in-progress shift. Each shift
 * must have `shiftStartTime` and `shiftEndTime` properties in a format that can be converted into a JavaScript
 * `Date` object.
 * @returns {object|null}
 */
const findInProgressShift = (shifts) => {
    const now = new Date();
    let inProgressShift = {};

    for (const shift of shifts) {
        const shiftStart = new Date(shift.shiftStartTime);
        const shiftEnd = new Date(shift.shiftEndTime);
        if ((now >= shiftStart) && (now <= shiftEnd)) {
            inProgressShift = shift;
            break;
        }
    }
    return inProgressShift;
};

/**
 * Returns the next future shift from a given array of shift objects.
 * @param {Array<object>} shifts The array of shift objects. Each shift must have a
 * `shiftStartTime` property in a format that can be converted to a JavaScript `Date` object.
 * @returns {object}
 */
const findNextUpcomingShift = (shifts) => {
    let upcomingShift = null;
    const now = new Date();

    for (const shift of shifts) {
        const shiftStartDate = new Date(shift.shiftStartTime);
        if (shiftStartDate > now && upcomingShift === null) {
            upcomingShift = shift;
            break;
        }
    }

    return upcomingShift || {};
}

export {
    findPreviousShifts,
    findInProgressShift,
    findNextUpcomingShift,
}