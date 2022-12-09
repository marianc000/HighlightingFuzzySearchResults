getMatches(strs) {
    return strs.filter(str => str.length >= MIN_LENGTH)
        .map(str => removeDiactrics(str).toLowerCase())
        .flatMap(str => this.map
            .filter(([k]) => Math.abs(str.length - k.length) <= MISMATHCES_ALLOWED)
            .filter(([k]) => damerauLevenshtein(str, k) <= MISMATHCES_ALLOWED)
            .flatMap(([k, v]) => v));
}