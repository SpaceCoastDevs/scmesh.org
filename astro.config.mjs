// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    starlight({
      title: "Space Coast Mesh",
      social: {
        github: "https://github.com/SpaceCoastDevs/scmesh.org",
      },
      sidebar: [
        {
          label: "Start Here",
          items: ["getting-started"],
        },
        // {
        //   label: "LILYGO T-Deck",
        //   items: ["lily-go-tdeck/introduction", "lily-go-tdeck/firmware"],
        // },
        {
          label: "Builds",
          autogenerate: {
            directory: "builds",
          },
        },
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
