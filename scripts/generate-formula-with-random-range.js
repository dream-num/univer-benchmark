import fs from 'fs'

const formulaNumber = 20000;

const cols = 10;
const randomDataRows = 10;
const rows = (formulaNumber / cols) + cols;
let matrix = {};

let formulaTypes = ['SUM', 'AVERAGE', 'MAX', 'MIN', 'COUNT'];
for (let row = 0; row < rows; row++) {
    matrix[row] = {};
    for (let col = 0; col < cols; col++) {
        if (row < randomDataRows) {
            // Fill the first 10 rows with random numbers
            matrix[row][col] = {v: Math.floor(Math.random()*10)};
        } else {

            let startRow = Math.floor(Math.random() * 6);
            let endRow = Math.floor(Math.random() * (randomDataRows - startRow)) + startRow;

            let startCol = Math.floor(Math.random() * 6);
            let endCol = Math.floor(Math.random() * (cols - startCol)) + startCol;

            let refStart = chatAtABC(startCol) + (startRow + 1) ;
            let refEnd = chatAtABC(endCol) + (endRow + 1);
            
            let formulaType = formulaTypes[Math.floor(Math.random() * formulaTypes.length)];
            matrix[row][col] = {f: `=${formulaType}(${refStart}:${refEnd})`};
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
