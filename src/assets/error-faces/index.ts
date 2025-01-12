const svgs = import.meta.glob('./*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const errorFaces = Object.entries(svgs).reduce<Record<string, string>>(
  (errorFaces, [path, content]) => {
    const name = path.replace('./', '').replace('.svg', '');
    errorFaces[name] = content as string;

    return errorFaces;
  },
  {}
);

export default errorFaces;
