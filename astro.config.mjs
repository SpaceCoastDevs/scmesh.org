// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: "https://scmesh.org",
  integrations: [
    starlight({
      title: "Space Coast Mesh",
      social: {
        github: "https://github.com/SpaceCoastDevs/scmesh.org",
      },
      sidebar: [
        {
          label: "Start Here",
          items: ["getting-started", "monday-night-meshup"],
        },
        // {
        //   label: "LILYGO T-Deck",
        //   items: ["lily-go-tdeck/introduction", "lily-go-tdeck/firmware"],
        // },
      ],
      logo: {
        src: "./src/assets/scmesh-ufo.svg",
      },
      favicon: "/scmesh-ufo.png",
      head: [
        // Add ICO favicon fallback for Safari.
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/favicon.ico",
            sizes: "32x32",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "manifest",
            href: "/site.webmanifest",
          },
        },
        // Open Graph
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "https://scmesh.org/scmesh-ufo-banner.png",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:type",
            content: "website",
          },
        },
        // Twitter / X card
        {
          tag: "meta",
          attrs: {
            name: "twitter:card",
            content: "summary_large_image",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image",
            content: "https://scmesh.org/scmesh-ufo-banner.png",
          },
        },
      ],
      customCss: [
        // Relative path to your custom CSS file
        "./src/styles/custom.css",
      ],
      editLink: {
        baseUrl: "https://github.com/SpaceCoastDevs/scmesh.org/edit/main/ ",
      },
    }),
  ],
});
