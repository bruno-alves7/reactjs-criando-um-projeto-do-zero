import { fireEvent, render, screen } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Header from '../../components/Header';

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

describe('Header', () => {
  beforeEach(() => {
    mockedPush.mockResolvedValue(true);
  });

  it('should be able to render logo', () => {
    render(<Header />);

    screen.getByAltText('logo');
  });

  it('should be able to navigate to home page after a click', () => {
    render(<Header />, {
      wrapper: RouterWrapper,
    });

    fireEvent.click(screen.getByAltText('logo'));

    expect(mockedPush).toHaveBeenCalledWith('/', {
      scroll: true,
    });
  });
});
