import groupBy from './groupBy.js';
import { damerauLevenshtein, removeDiactrics } from './strings.js';

const MISMATHCES_ALLOWED = 1;
const MIN_LENGTH = 3;
const HIGHLIGHT_NAME = 'match';

const RE_STR = `[\\p{L}]{${MIN_LENGTH},}`;

function mapNodes(container) {
    const nodes = textNodes(container);
    let c = 0;
    return nodes.map((node, i) => {
        let text = node.nodeValue;
        if (!node.parentElement.closest('pre')) {
            text = node.nodeValue.replace(/\n+ +/g, ' ');
            node.nodeValue = text;
        }

        let start = c;
        c += text.length;
        let end = c;
        return {
            start, end, text, node, i
        }
    });
}

function textNodes(parent) {
    return [...parent.childNodes].flatMap(node => {
        switch (node.nodeType) {
            case Node.TEXT_NODE:
                return node;
            case Node.ELEMENT_NODE:
                return textNodes(node);
            default:
                console.log(node.type, node.nodeValue)
                parent.removeChild(node);
        }
    }).filter(n => n);
}

export default class HighlightingElement {

    constructor(container) {
        this.nodes = mapNodes(container);
        this.text = container.textContent;
        this.container = container;

        const matches = [...this.text.matchAll(new RegExp(RE_STR, 'dgu'))];

        const words = matches.map(match => {
            const str = match[0];
            const start = match.indices[0][0];
            const end = match.indices[0][1];

            const [startContainer, startOffset] = this.getBoundaryPoint(start);
            const [endContainer, endOffset] = this.getBoundaryPoint(end);
            return [removeDiactrics(str).toLowerCase(), new StaticRange({ startContainer, startOffset, endContainer, endOffset })];
        });

        this.map = groupBy(words);
    }

    getMatches(strs) {
        return strs.filter(str => str.length >= MIN_LENGTH)
            .map(str => removeDiactrics(str))
            .flatMap(str => this.map
                .filter(([k]) => Math.abs(str.length - k.length) <= MISMATHCES_ALLOWED)
                .filter(([k]) => damerauLevenshtein(str, k) <= MISMATHCES_ALLOWED)
                .flatMap(([k, v]) => v));
    }

    getBoundaryPoint(pos) {
        const node = this.nodes.find(n => n.start <= pos && n.end > pos);
        const offset = pos - node.start;
        return [node.node, offset];
    }

    highlight(strs) {
        if (!strs.length) {
            return CSS.highlights.delete(HIGHLIGHT_NAME);
        }
        const ranges = this.getMatches(strs);

        console.log(ranges.length);
        CSS.highlights.set(HIGHLIGHT_NAME, new Highlight(...ranges));
    }
}
