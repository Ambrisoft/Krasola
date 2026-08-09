// Isolated utility functions for Iconify API operations and SVG transformations

export async function fetchIconsList(query, collection = '') {
  if (!query) return [];
  try {
    let url = `https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=48`;
    if (collection) {
      url += `&prefix=${encodeURIComponent(collection)}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data && data.icons ? data.icons : [];
  } catch (error) {
    console.error('Error fetching icons list:', error);
    return [];
  }
}

export async function fetchRawSvg(iconName) {
  if (!iconName) return '';
  try {
    const [prefix, name] = iconName.split(':');
    const response = await fetch(`https://api.iconify.design/${prefix}/${name}.svg`);
    return await response.text();
  } catch (error) {
    console.error('Error fetching raw SVG:', error);
    return '';
  }
}

export function modifySvg(svgText, { size, strokeWidth, color, rotation, flipH, flipV }) {
  if (!svgText) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');

  if (svgEl) {
    svgEl.setAttribute('width', size.toString());
    svgEl.setAttribute('height', size.toString());

    // Inject custom colors and stroke widths
    const allPaths = svgEl.querySelectorAll('path, circle, rect, polygon, ellipse, line, polyline');
    allPaths.forEach(path => {
      if (path.getAttribute('stroke') && path.getAttribute('stroke') !== 'none') {
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', strokeWidth.toString());
      }
      if (path.getAttribute('fill') && path.getAttribute('fill') !== 'none') {
        path.setAttribute('fill', color);
      }
    });

    // Apply transformations
    const transformParts = [];
    if (rotation) transformParts.push(`rotate(${rotation})`);
    if (flipH || flipV) {
      const sx = flipH ? -1 : 1;
      const sy = flipV ? -1 : 1;
      // standard viewbox is 24x24 or similar. Find SVG viewbox or use midpoint
      let cx = 12, cy = 12;
      const viewBox = svgEl.getAttribute('viewBox');
      if (viewBox) {
        const parts = viewBox.split(' ').map(Number);
        if (parts.length === 4) {
          cx = parts[2] / 2;
          cy = parts[3] / 2;
        }
      }
      transformParts.push(`translate(${cx} ${cy}) scale(${sx} ${sy}) translate(${-cx} ${-cy})`);
    }

    if (transformParts.length > 0) {
      // Wrap children in a transform group
      const group = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('transform', transformParts.join(' '));
      while (svgEl.firstChild) {
        group.appendChild(svgEl.firstChild);
      }
      svgEl.appendChild(group);
    }

    return new XMLSerializer().serializeToString(doc);
  }
  return svgText;
}

// Formats properties into camelCase React attributes
export function convertSvgToJsx(svgText) {
  if (!svgText) return '';
  return svgText
    .replace(/class=/g, 'className=')
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-linecap=/g, 'strokeLinecap=')
    .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/stroke-miterlimit=/g, 'strokeMiterlimit=')
    .replace(/fill-rule=/g, 'fillRule=')
    .replace(/clip-rule=/g, 'clipRule=')
    .replace(/stroke-dasharray=/g, 'strokeDasharray=')
    .replace(/stroke-dashoffset=/g, 'strokeDashoffset=')
    .replace(/stroke-opacity=/g, 'strokeOpacity=')
    .replace(/fill-opacity=/g, 'fillOpacity=');
}
