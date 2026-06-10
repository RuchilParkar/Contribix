import { unstable_cache } from 'next/cache';
import { fetchGitHubUserData } from '../github';

export const getCachedGitHubUserData = unstable_cache(
  async (username: string) => {
    return fetchGitHubUserData(username);
  },
  ['github-profile-data'],
  {
    revalidate: 3600, // cache for 1 hour
    tags: ['github-profile'],
  }
);
