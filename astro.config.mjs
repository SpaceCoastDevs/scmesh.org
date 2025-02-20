// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Space Coast Meshtastic",
      social: {
        github: "https://github.com/SpaceCoastDevs/scmesh.org",
      },
      //   sidebar: [
      //     {
      //       label: "Guides",
      //       items: [
      //         // Each item here is one entry in the navigation menu.
      //         { label: "Example Guide", slug: "guides/example" },
      //       ],
      //     },
      //     {
      //       label: "Reference",
      //       autogenerate: { directory: "reference" },
      //     },
      //   ],
      logo: {
        src: "./src/assets/scmeshtastic.svg",
      },
      favicon: "/scmesh.svg",
      customCss: [
        // Relative path to your custom CSS file
        "./src/styles/custom.css",
      ],
    }),
  ],
});
