import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data';
import { getPublishedPosts, postUrl } from './utils/posts';

export const onRequest = defineRouteMiddleware(async (context) => {
  const route = context.locals.starlightRoute;
  const posts = await getPublishedPosts();
  const link = (label: string, href: string) => ({
    type: 'link' as const, label, href,
    isCurrent: context.url.pathname.replace(/\/$/, '') === href.replace(/\/$/, ''),
    badge: undefined, attrs: {},
  });
  const group: StarlightRouteData['sidebar'][number] = {
    type: 'group', label: 'Posts', collapsed: false, badge: undefined,
    entries: [link('All posts', '/posts/'), ...posts.map((post) => link(post.data.title, postUrl(post.id)))],
  };
  route.sidebar = route.sidebar.map((entry) =>
    entry.type === 'link' && entry.href === '/posts/' ? group : entry
  );
});
