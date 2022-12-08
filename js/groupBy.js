export default function groupBy(data) {
    const map = {};
    data.forEach(([key, val]) => {
        if (!map[key])
            map[key]=new Set() ;
        map[key].add(val);
    });
 
    return Object.entries(map).map(([k,v])=>([k,[...v]]));
};

