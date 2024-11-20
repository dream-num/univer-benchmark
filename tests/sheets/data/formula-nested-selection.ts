import { chatAtABC } from "./util";

export function generateNestedSelection(cells: number) {
    const matrix = {};
    const cols = 20;
    const rows = Math.ceil(cells / cols) + 1;
    let maxCol = chatAtABC(cols - 1);

    let formulaTypes = ['SUM', 'AVERAGE', 'MAX', 'MIN', 'COUNT'];
    for (let row = 0; row < rows; row++) {
        matrix[row] = {};
        for (let col = 0; col < cols; col++) {
            if (row === 0) {
                // Fill the first row with random numbers
                matrix[row][col] = { v: Math.floor(Math.random() * 2) };
            } else {
                // Other rows use formulas to reference data from the previous row
                let refRow = row - 1;

                let formulaType = formulaTypes[Math.floor(Math.random() * formulaTypes.length)];
                matrix[row][col] = { f: `=${formulaType}(A${refRow + 1}:${maxCol}${refRow + 1})` };
            }
        }
    }

    return matrix;
}