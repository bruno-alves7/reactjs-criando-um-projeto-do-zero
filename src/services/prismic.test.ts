import * as prismic from '@prismicio/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getPrismicClient, hasPrismicEndpoint } from './prismic';

vi.mock('@prismicio/client', () => ({
  createClient: vi.fn(),
}));

const mockedCreateClient = vi.mocked(prismic.createClient);

describe('getPrismicClient', () => {
  afterEach(() => {
    delete process.env.PRISMIC_API_ENDPOINT;
  });

  it('returns whether a Prismic endpoint is configured', () => {
    expect(hasPrismicEndpoint()).toBe(false);

    process.env.PRISMIC_API_ENDPOINT = 'https://example.cdn.prismic.io/api/v2';

    expect(hasPrismicEndpoint()).toBe(true);
  });

  it('creates a Prismic client with the configured endpoint', () => {
    const client = { repositoryName: 'blog' };
    process.env.PRISMIC_API_ENDPOINT = 'https://example.cdn.prismic.io/api/v2';

    mockedCreateClient.mockReturnValue(
      client as ReturnType<typeof prismic.createClient>,
    );

    const response = getPrismicClient();

    expect(mockedCreateClient).toHaveBeenCalledWith(
      'https://example.cdn.prismic.io/api/v2',
    );
    expect(response).toBe(client);
  });

  it('throws when the endpoint is not configured', () => {
    expect(() => getPrismicClient()).toThrow(
      'PRISMIC_API_ENDPOINT is not configured.',
    );
  });
});
