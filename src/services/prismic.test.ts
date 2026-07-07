import * as prismic from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';
import { describe, expect, it, vi } from 'vitest';

import { getPrismicClient, type PrismicConfig } from './prismic';

vi.mock('@prismicio/client', () => ({
  createClient: vi.fn(),
}));

vi.mock('@prismicio/next', () => ({
  enableAutoPreviews: vi.fn(),
}));

const mockedCreateClient = vi.mocked(prismic.createClient);
const mockedEnableAutoPreviews = vi.mocked(enableAutoPreviews);

describe('getPrismicClient', () => {
  it('creates a Prismic client with auto previews enabled', () => {
    const client = { repositoryName: 'blog' };
    const req = { headers: {} } as PrismicConfig['req'];
    process.env.PRISMIC_API_ENDPOINT = 'https://example.cdn.prismic.io/api/v2';

    mockedCreateClient.mockReturnValue(
      client as ReturnType<typeof prismic.createClient>,
    );

    const response = getPrismicClient({ req });

    expect(mockedCreateClient).toHaveBeenCalledWith(
      'https://example.cdn.prismic.io/api/v2',
    );
    expect(mockedEnableAutoPreviews).toHaveBeenCalledWith({
      client,
      req,
    });
    expect(response).toBe(client);
  });
});
