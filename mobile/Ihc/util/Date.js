export function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

// Given a Date object, returns string in format yyyymmdd
export function stringDate(dateObj) {
  const month = dateObj.getMonth()+1 < 10 ? '0' + (dateObj.getMonth()+1) : dateObj.getMonth()+1;
  const date = dateObj.getDate()+1 < 10 ? '0' + (dateObj.getDate()+1) : dateObj.getDate()+1;
  return `${dateObj.getFullYear()}${month}${date}`
}
