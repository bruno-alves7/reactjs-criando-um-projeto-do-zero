import * as prismic from '@prismicio/client';

export function hasPrismicEndpoint(): boolean {
  return Boolean(process.env.PRISMIC_API_ENDPOINT);
}

export function getPrismicClient(): prismic.Client {
  if (!process.env.PRISMIC_API_ENDPOINT) {
    throw new Error('PRISMIC_API_ENDPOINT is not configured.');
  }

  return prismic.createClient(process.env.PRISMIC_API_ENDPOINT);
}
