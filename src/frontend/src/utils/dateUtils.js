/**
 * Get the year month and day in the string format YYYY-MM-DD from a date object.
 * @param {Date} dateObj The date to be converted.
 * @returns The date string in the format YYYY-MM-DD.
 */
const getYearMonthDay = (dateObj) => {
    const year = dateObj.getFullYear().toString();
    const month = (dateObj.getMonth() + 1).toString();
    const day = dateObj.getDate().toString();
    const yearMonthDay = [year, month, day].map(str => str.padStart(2, "0")).join("-");
    // console.log(yearMonthDay);
    return yearMonthDay;
}

/**
 * Compares two dates to see if they share the same year, month, and day.
 * @param {*} dateObj1 The first date object.
 * @param {*} dateObj2 The second date object.
 * @returns A boolean indicating whether the two dates are the same (year, month, and day).
 */
const compareDates = (dateObj1, dateObj2) => {
    const date1 = getYearMonthDay(dateObj1);
    const date2 = getYearMonthDay(dateObj2);
    // console.log(`${date1} === ${date2} : ${date1 === date2}`);
    return date1 === date2;
};

/**
 * Converts a date string to a a Date object.
 * @param {*} date The dates string.
 * @returns The datestring converted to a Date object.
 */
const dateAsObj = (date) => {
    return new Date(date);
}

/**
 * Adds a variable number of hours to a date.
 * @param {Date} date 
 * @param {number} hours 
 * @returns The date with the specified number of hours added to it.
 */
const plusHours = (date, hours) => {
    const newDate = new Date(date.setHours(date.getHours() + hours));
    return newDate;
}

/**
 * Subtracts a variable number of hours fom a date.
 * @param {Date} date 
 * @param {number} hours 
 * @returns The date with the specified number of hours subtracted from it.
 */
const minusHours = (date, hours) => {
    const newDate = new Date(date.setHours(date.getHours() - hours));
    return newDate;
}

/**
 * Strip the seconds from a date object so that the time will be: HH:SS:00.
 * @param {Date} date The date object.
 * @returns The date object with 0 seconds on the time.
 */
const zeroSeconds = (date) => {
    return date.setTime(date.getTime() - (date.getSeconds() * 1000))
}

export {
    getYearMonthDay,
    compareDates,
    dateAsObj,
    plusHours,
    minusHours,
    zeroSeconds,
}