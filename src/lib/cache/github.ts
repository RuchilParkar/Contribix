import { unstable_cache } from 'next/cache';
import { fetchGitHubUserData } from '../github';

const cachedFetcher = unstable_cache(
  async (username: string) => {
    return fetchGitHubUserData(username);
  },
  ['github-profile-data'],
  {
    revalidate: 3600, // cache for 1 hour
    tags: ['github-profile'],
  }
);

export const getCachedGitHubUserData = async (username: string) => {
  try {
    return await cachedFetcher(username);
  } catch (error) {
    console.warn("Next.js unstable_cache failed, falling back to direct fetch:", error);
    return fetchGitHubUserData(username);
  }
};
