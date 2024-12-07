const svgs = import.meta.glob('./*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});

function removeSizeAttributes(content: string) {
  const doc = new DOMParser().parseFromString(content, 'image/svg+xml');
  const svgElement = doc.querySelector('svg');

  if (svgElement) {
    svgElement.removeAttribute('width');
    svgElement.removeAttribute('height');
    return svgElement.outerHTML;
  }

  return content;
}

const icons = Object.entries(svgs).reduce<Record<string, string>>((icons, [path, content]) => {
  const name = path.replace('./', '').replace('.svg', '');
  icons[name] = removeSizeAttributes(content as string);

  return icons;
}, {});

export default icons;
