const styles = {
  // To add base, top-level styles to the <html> or <body> element
  // in this case the below styles apply to the <html> element as per the flag we set on the theme index.js
  root: {
    minHeight: '100%',
    margin: '0',
    color: 'text',
    backgroundColor: 'background',
    fontFamily: 'body',
    lineHeight: 'body',
    fontWeight: 'body',
    // We don't set the font-size on the body. Rather we default to the browser default of 16px.
    // To disable applying styles to the <body> element, add the `useBodyStyles: false` flag to your theme.
  },
  h1: {
    color: 'heading',
    variant: 'text.heading',
    fontSize: [10, 10, 10, 10],
  },
  h2: {
    color: 'text',
    variant: 'text.heading',
    fontSize: ['40px', 8, 9, 9],
  },
  h3: {
    color: 'text',
    variant: 'text.heading',
    fontSize: ['64px', '64px', 8, 8],
  },
  h4: {
    color: 'text',
    variant: 'text.heading',
    fontSize: [6, 7, 7, 7],
  },
  h5: {
    color: 'text',
    variant: 'text.heading',
    fontSize: [6, 6, 6, 6],
  },
  h6: {
    color: 'text',
    variant: 'text.heading',
    fontSize: [5, 5, 5, 5],
  },
  p: {
    color: 'text',
    variant: 'text.paragraph',
    fontSize: [5, 5, 5, 5],
  },
  li: {
    listStyle: 'none',
    display: 'flex',
    color: 'text',
    variant: 'text.paragraph',
    fontSize: [4, 4, 4, 4],
    px: [2, 2, 4, 4],
  },
  a: {
    fontSize: [5, 5, 5, 5],
    color: 'primary',
    '&:hover': {
      color: 'navHoverColor',
      opacity: '0.65',
    },
  },
  pre: {
    fontFamily: 'monospace',
    overflowX: 'auto',
    code: {
      color: 'inherit',
    },
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 'inherit',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
  },
  th: {
    textAlign: 'left',
    borderBottomStyle: 'solid',
  },
  td: {
    textAlign: 'left',
    borderBottomStyle: 'solid',
  },
  img: {
    display: 'block',
    maxWidth: '100%',
  },
  picture: {
    display: 'block',
    maxWidth: '100%',
  },
  video: {
    display: 'block',
    maxWidth: '100%',
  },
  canvas: {
    display: 'block',
    maxWidth: '100%',
  },
  svg: {
    display: 'block',
    maxWidth: '100%',
  },
}

export default styles
