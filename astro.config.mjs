// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightKbd from "starlight-kbd";


// https://astro.build/config
export default defineConfig({
  integrations: [
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
        {
          label: "LILYGO T-Deck",
          items: [
            { link: "lily-go-tdeck/introduction", label: "Introduction" },
            "lily-go-tdeck/firmware",
          ],
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
      plugins: [
        starlightKbd({
          types: [
            { id: "mac", label: "macOS" },
            { id: "windows", label: "Windows", default: true },
          ],
        }),
      ],
    }),
  ],
});
