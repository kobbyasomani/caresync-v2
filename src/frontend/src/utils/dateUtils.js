const getYearMonthDay = (dateObj) => {
    const year = dateObj.getFullYear().toString();
    const month = dateObj.getMonth().toString();
    const day = dateObj.getDate().toString();
    const yearMonthDay = [year, month, day].map(str => str.padStart(2, "0")).join("-");
    // console.log(yearMonthDay);
    return yearMonthDay;
}

const compareDates = (dateObj1, dateObj2) => {
    const date1 = getYearMonthDay(dateObj1);
    const date2 = getYearMonthDay(dateObj2);
    // console.log(`${date1} === ${date2} : ${date1 === date2}`);
    return date1 === date2;
};

const dateAsObj = (date) => {
    return new Date(date);
}

export {
    getYearMonthDay,
    compareDates,
    dateAsObj,
}