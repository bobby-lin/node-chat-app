var moment = require('moment');
var date = moment();

// Example: Jan 1st 2008
// date.add(1, 'year');
// console.log(date.format('MMM Do YYYY'));

// Example: 10:30 am, 6:09 am
console.log(date.format('h:mm a'));

date.add(7, 'hour');
console.log(date.format('h:mm a'));
