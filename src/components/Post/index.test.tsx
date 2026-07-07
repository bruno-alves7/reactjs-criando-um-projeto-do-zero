import { render, screen } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { describe, expect, it, vi } from 'vitest';

import Post from '.';
import type { PostSummary } from '../../types';

const mockedPush = vi.fn();

function RouterWrapper({ children }: { children: React.ReactNode }) {
  const MockedRouterContext = RouterContext as React.Context<unknown>;

  return (
    <MockedRouterContext.Provider
      value={{
        push: mockedPush,
      }}
    >
      {children}
    </MockedRouterContext.Provider>
  );
}

describe('Post card', () => {
  it('renders a post without publication date', () => {
    const post: PostSummary = {
      uid: 'sem-data',
      first_publication_date: null,
      data: {
        title: 'Post sem data',
        subtitle: 'Fallback de data para posts incompletos.',
        author: 'Bruno Alves',
      },
    };

    render(<Post post={post} />, {
      wrapper: RouterWrapper,
    });

    expect(
      screen.getByRole('heading', { name: 'Post sem data' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Fallback de data para posts incompletos.'),
    ).toBeInTheDocument();
  });
});
