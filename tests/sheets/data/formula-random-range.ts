import { chatAtABC } from "./util";

export function generateRandomRange(cells: number) {
    const cols = 10;
    const randomDataRows = 10;
    const rows = (cells / cols) + randomDataRows;
    let matrix = {};

    let formulaTypes = ['SUM', 'AVERAGE', 'MAX', 'MIN', 'COUNT'];
    for (let row = 0; row < rows; row++) {
        matrix[row] = {};
        for (let col = 0; col < cols; col++) {
            if (row < randomDataRows) {
                // Fill the first 10 rows with random numbers
                matrix[row][col] = { v: Math.floor(Math.random() * 10) };
            } else {

                let startRow = Math.floor(Math.random() * 6);
                let endRow = Math.floor(Math.random() * (randomDataRows - startRow)) + startRow;

                let startCol = Math.floor(Math.random() * 6);
                let endCol = Math.floor(Math.random() * (cols - startCol)) + startCol;

                let refStart = chatAtABC(startCol) + (startRow + 1);
                let refEnd = chatAtABC(endCol) + (endRow + 1);

                let formulaType = formulaTypes[Math.floor(Math.random() * formulaTypes.length)];
                matrix[row][col] = { f: `=${formulaType}(${refStart}:${refEnd})` };
            }
        }
    }
    return matrix;
}