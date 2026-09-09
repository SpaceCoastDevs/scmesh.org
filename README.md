# Starlight Starter Kit: Basics

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

```
npm create astro@latest -- --template starlight
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/starlight/tree/main/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/starlight/tree/main/examples/basics)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/withastro/starlight&create_from_path=examples/basics)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwithastro%2Fstarlight%2Ftree%2Fmain%2Fexamples%2Fbasics&project-name=my-starlight-docs&repository-name=my-starlight-docs)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro + Starlight project, you'll see the following folders and files:

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   ├── docs/
│   └── content.config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.

Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

## Posts

Add Markdown (`.md`) or MDX (`.mdx`) files to `src/content/posts/`.
The `posts` collection validates their frontmatter:

```md
---
title: My first post
description: A short summary of the post.
pubDate: 2026-09-08
author: Your name
tags:
  - community
draft: true
---

Write your post here.
```

`title`, `description`, and `pubDate` are required. `author` and
`updatedDate` (a date) are optional. `tags` defaults to an empty list and
`draft` defaults to `false`.

Posts appear at `/posts/`, newest first, with individual pages at
`/posts/<filename>/`. Entries with `draft: true` are excluded from both the
listing and generated pages.

The sidebar automatically lists published posts under **Posts**, newest first.
`src/utils/posts.ts` supplies the same published-post ordering to the sidebar,
index, and routes. Drafts are excluded from all three.

The list and article layouts live in `src/layouts/PostsLayout.astro` and
`src/layouts/PostLayout.astro`. Their shared page heading is customized in
`src/components/PageTitle.astro`; other pages retain Starlight's default heading.

## Contact form (Netlify)

The `/contact/` page includes a static Netlify form named `contact`, with a
honeypot for spam filtering and a success page at `/contact/thanks/`.

In the Netlify project dashboard, open **Forms** and enable form detection
before deploying. After deployment, confirm that the `contact` form is detected.
Submissions appear in Netlify Forms; configure form notifications there if you
want email alerts. Submission handling requires Netlify and cannot be verified
with the local Astro preview server.

See [Netlify Forms setup](https://docs.netlify.com/manage/forms/setup/).

## Mesh demonstration

The getting-started page hydrates `MeshTopology` when it becomes visible.
Its styles live in `src/components/MeshTopology.css`; the relay graph and wave
calculation live in `src/utils/meshTopology.ts`. The simulation starts paused,
runs entirely in the browser, and sends no messages to real radios.

Run the relay regression tests with Node 22.6 or later:

```sh
node --experimental-strip-types --test tests/meshTopology.test.mjs
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Check out [Starlight’s docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or jump into the [Astro Discord server](https://astro.build/chat).
