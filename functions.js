// FUNCTIONS

export const functions = {
  randomInt: (min = 0, max = 1) =>
    Math.floor(Math.random() * (max - min + 1)) + min,
  randomFromArray: (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  shuffleArray: (arr) => {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
  },
  randomYear: () => {
    let currentYear = new Date().getFullYear();
    let year = `${functions.randomInt(currentYear - 90, currentYear)}`;
    if (Math.random() < 0.5) year = year.slice(2);
    return year;
  },
};