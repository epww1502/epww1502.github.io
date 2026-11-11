import createMDX from '@next/mdx';

/** Static export for GitHub Pages. Case studies are MDX files in content/cases. */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

export default createMDX()(nextConfig);
