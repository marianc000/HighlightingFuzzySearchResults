import HighlightingElement from './HighlightingElement.js';

const highlightingElement = new HighlightingElement(textDiv);

searchInput.addEventListener('input', onInput);

function onInput( ) {
    const strs = searchInput.value.split(' ').filter(s => s);
    highlightingElement.highlight(strs);
}

onInput( );