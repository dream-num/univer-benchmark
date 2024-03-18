/**
 * 20,000 rows of data, one VLOOKUP formula per row, no duplicate values, vlookup references all scopes
 */

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
            f: `=VLOOKUP(A${i + 1},A1:H${rows},8)`
        };

        matrix[i] = rowData;
    }

    return matrix;
}


export const formula20000WithVlookupAllRange = () => {
return generateData(20000);
} 