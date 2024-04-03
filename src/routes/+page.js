import tsvData from '$lib/data.tsv?raw'

function expandSpellType(type) {
    switch (type) {
        case 'C':
            return 'Combat';
        case 'L':
            return 'Leveling';
        case 'H':
            return 'Healing';
        case 'U':
            return 'Utility';
        default:
            return 'None';
    }
}

/** @type {import('./types').PageLoad} */
export function load({ params }) {

    const data_rows = tsvData.split("\n")
    const keys = data_rows[0].split('\t')
    const data = [];

    data_rows.shift();
    data_rows.forEach((row, row_index) => {
        let jsonRow = {};
        let columnValues = row.split(/[\t\n]/);
        columnValues.forEach((value, index) => jsonRow[keys[index]] = value)

        // expand the type to full words:
        jsonRow['type'] = expandSpellType(jsonRow['type']);

        data.push(jsonRow);
    })

    // console.log(data);
    return { data }
}