const inputs = [
    [0, 0, 0, 0],
	[0, 0, 0, 1],
	[0, 0, 1, 0],
	[0, 0, 1, 1],
	[0, 1, 0, 0],
	[0, 1, 0, 1],
	[0, 1, 1, 0],
	[0, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 1],
	[1, 0, 1, 0],
	[1, 0, 1, 1],
	[1, 1, 0, 0],
	[1, 1, 0, 1],
	[1, 1, 1, 0],
	[1, 1, 1, 1],
];

export function renderInput(linesCount) {
    let tableContent = '<tr>';

    for (let lc = 0; lc < linesCount; lc++) {
        tableContent += `<th>x${lc+1}</th>`;
    }
    for (let lc = 0; lc < linesCount; lc++) {
        tableContent += `<th>y${lc+1}</th>`;
    }
    tableContent += '</tr>';

    const rows = Math.pow(2, linesCount);

    for (let inRow = 0; inRow < rows; inRow++) {
        tableContent += '<tr>';

        const columnStart = inputs[0].length - linesCount;
        for (let inColumn = columnStart; inColumn < inputs[0].length; inColumn++) {
            tableContent += `<td>${inputs[inRow][inColumn]}</td>`;
        }

        for (let inColumn = columnStart; inColumn < inputs[0].length; inColumn++) {
            tableContent += `<td><input type="number" class="tt-input-cell-${linesCount}" id="synth-in-bit-${inRow}-${inColumn-columnStart}"></td>`;
        }

        tableContent += '</tr>';
    }

    return tableContent;
}

export function build(linesCount) {
    if (!linesCount) {
        throw new Error('Invalid lines count');
    }

    let ins = [];
    const rowsCount = Math.pow(2, linesCount);
    const columnStart = inputs[0].length - linesCount;

    for (let row = 0; row < rowsCount; row++) {
        let columnValues = [];
        for (let column = columnStart; column < inputs[0].length; column++) {
            columnValues.push(inputs[row][column]);
        }

        ins.push(columnValues);
    }

    let outs = [];
    for (let row = 0; row < ins.length; row++) {
        let columnValues = [];
        for (let column = 0; column < ins[0].length; column++) {
            const out = document.querySelector(`#synth-in-bit-${row}-${column}`).value;
            if (!out) {
                throw new Error(`missing value at y${column+1} row ${row+1} (counting rows from 1)`);
            }
            columnValues.push(parseInt(out));
        }
        outs.push(columnValues);
    }

    return { in: ins, out: outs };
}
