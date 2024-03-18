import fs from 'fs'

const rows = 1001;
const cols = 20;
let maxCol = chatAtABC(cols - 1);
let matrix = {};

let formulaTypes = ['SUM', 'AVERAGE', 'MAX', 'MIN', 'COUNT'];
for (let row = 0; row < rows; row++) {
    matrix[row] = {};
    for (let col = 0; col < cols; col++) {
        if (row === 0) {
            // Fill the first row with random numbers
            matrix[row][col] = {v: Math.floor(Math.random()*2)};
        } else {
            // Other rows use formulas to reference data from the previous row
            let refRow = row - 1;
            
            let formulaType = formulaTypes[Math.floor(Math.random() * formulaTypes.length)];
            matrix[row][col] = {f: `=${formulaType}(A${refRow + 1}:${maxCol}${refRow + 1})`};
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
