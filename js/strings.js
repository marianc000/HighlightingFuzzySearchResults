export function damerauLevenshtein(a, b) {
    const d = [];
    for (let i = 0; i <= a.length; i++) {
        d[i] = [i];
    }

    for (let j = 0; j <= b.length; j++) {
        d[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            let cost = a.at(i - 1) === b.at(j - 1) ? 0 : 1;
            d[i][j] = Math.min(d[i - 1][j] + 1, // deletion
                d[i][j - 1] + 1, // insertion
                d[i - 1][j - 1] + cost)  // substitution

            if (i > 1 && j > 1 && a.at(i - 1) === b.at(j - 1 - 1) && a.at(i - 1 - 1) === b.at(j - 1))
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)  // transposition
        }
    }

    return d[a.length][b.length];
}

console.log(damerauLevenshtein("number", "nombre"));

export function removeDiactrics(s) {
    return s.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

console.log(removeDiactrics("Âge d'être dédain arrêter garçon été désiré"));


