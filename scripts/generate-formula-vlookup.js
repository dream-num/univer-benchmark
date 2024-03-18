import fs from 'fs'

const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew'];

function generateData(rows) {
    const matrix = {};

    for (let i = 0; i < rows; i++) {
        const rowData = {};

        // Generate fruit values for each column
        fruits.forEach((fruit, index) => {
            rowData[index] = { v: `${fruit}${i + 1}` };
        });

        // Add VLOOKUP function in the last column
        rowData[8] = {
            f: `=VLOOKUP(A${i + 1},A${i + 1}:H${i + 1},8)`
        };

        matrix[i] = rowData;
    }

    return matrix;
}

const matrix = generateData(20000);
// Write matrix data to JSON file
fs.writeFile('matrix_data.json', JSON.stringify(matrix, null, 2), (err) => {
    if (err) throw err;
    console.log('Data has been written to matrix_data.json');
});
