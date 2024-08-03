
// expands template expressions recursively, returning total 
// the expansions in a list.
function expandOnce(code) {
    // iterate through each of code's characters
    for (let i = 0; i < code.length; i++) {
        // if the character starts an expansion, then expand
        if (code[i] === '$' && i + 2 < code.length) {
            let startExpr = i;

            if (i + 1 < code.length && code[i + 1] === '[') {

                // iterate through characters until either another expansion is found,
                // or this expansion ends. If the code ends without either of
                // those scenarios happening, then throw and error:
                i++;
                for (; code[i] != ']' && code[i] != '$' && i < code.length; i++);

                // if an embedded expansion is found, throw and error
                if (code[i] == '$' && i + 1 < code.length && code[i + 1] == '[') {
                    throw Error(`error character ${i}: ssslang does not currently support nested expressions.`)
                }

                else if (code[i] == ']') {
                    let values = code.substring(startExpr + 2, i).split(';').map(v => v.trim());
                    return values.map(insert => code.substring(0, startExpr) + insert + code.substring(i + 1));
                }

                else {
                    throw Error(`no closing "]" for opening "$[" on character ${startExpr}.`)
                }
            }
        }
    }
}

function expandAll(code) {
    let expansions = [];
    let oldLength = expansions.length;

    expansions = expandOnce(code);
    while (expansions.length > oldLength) {
        oldLength = expansions.length;
        // compose a new array:
        expansions.forEach(e => {
            let expansion = expandOnce(e);
            if (expansion) {
                expansions = [...expansions.filter((m) => m !== e), ...expansion];
            }
        });
    }

    return expansions;
}

export { expandAll, expandOnce }
