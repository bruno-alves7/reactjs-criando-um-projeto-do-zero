import { describe, expect, it } from 'vitest';

import {
  fallbackPosts,
  getFallbackPostBySlug,
  getFallbackPostsPage,
} from './posts';

describe('fallback posts', () => {
  it('returns fallback posts as a pagination page', () => {
    const page = getFallbackPostsPage();

    expect(page.next_page).toBeNull();
    expect(page.results).toHaveLength(fallbackPosts.length);
    expect(page.results[0]).toEqual({
      uid: fallbackPosts[0].uid,
      first_publication_date: fallbackPosts[0].first_publication_date,
      data: {
        title: fallbackPosts[0].data.title,
        subtitle: fallbackPosts[0].data.subtitle,
        author: fallbackPosts[0].data.author,
      },
    });
  });

  it('returns a fallback post by slug or the first fallback post', () => {
    expect(getFallbackPostBySlug('testes-com-vitest').uid).toBe(
      'testes-com-vitest',
    );
    expect(getFallbackPostBySlug('missing-post')).toBe(fallbackPosts[0]);
  });
});
