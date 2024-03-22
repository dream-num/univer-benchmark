import fs from 'fs'

const rows = 5001;
const cols = 20;
let maxCol = chatAtABC(10);
let matrix = {};

for (let row = 0; row < rows; row++) {
    matrix[row] = {};
    for (let col = 0; col < cols; col++) {
        if (row === 0) {
            // Fill the first row with random numbers
            matrix[row][col] = {v: 1};
        } else {
            const colName = chatAtABC(col);
            matrix[row][col] = {f: `=COUNT(${colName}${1}:${colName}${row})`};
        }
    }
}

function chatAtABC(n) {
    const ord_a = 'a'.charCodeAt(0);

    const ord_z = 'z'.charCodeAt(0);

    const len = ord_z - ord_a + 1;

    let s = '';

    while (n >= 0) {
        s = String.fromCharCode((n % len) + ord_a) + s;

        n = Math.floor(n / len) - 1;
    }

    return s.toUpperCase();
}

// Write matrix data to JSON file
fs.writeFile('matrix_data.json', JSON.stringify(matrix, null, 2), (err) => {
    if (err) throw err;
    console.log('Data has been written to matrix_data.json');
});
