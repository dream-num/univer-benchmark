function setValues (values: string[][]) {
    const univerAPI = window.univerAPI;
    if (!univerAPI) throw Error('univerAPI is not defined');

    const activeWorkbook = univerAPI.getActiveWorkbook();
    if (!activeWorkbook) throw Error('activeWorkbook is not defined');
    const activeSheet = activeWorkbook.getActiveSheet();
    if (!activeSheet) throw Error('activeSheet is not defined');

    const range = activeSheet.getRange(0, 0, values.length, values[0].length);
    if (!range) throw Error('range is not defined');

    range.setValues(values);
}
