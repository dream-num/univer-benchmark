import { chatAtABC } from "./util";

export function generateNestedSum(cells: number) {
    const matrix = {};
    const cols = 20;
    const rows = Math.ceil(cells / cols) + 1;
    
    for (let row = 0; row < rows; row++) {
        matrix[row] = {};
        for (let col = 0; col < cols; col++) {
            if (row === 0) {
                matrix[row][col] = {v: 1};
            } else {
    
                matrix[row][col] = {f: `=SUM(${chatAtABC(col)}${row}+1)`};
            }
        }
    }

    return matrix;
}