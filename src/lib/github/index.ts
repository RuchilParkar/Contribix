import { env } from '../env';

export interface GitHubProfile {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
}

export interface RepoDetails {
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string;
  languages: Record<string, number>;
  url: string;
  updatedAt: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ProfileData {
  profile: GitHubProfile;
  repos: RepoDetails[];
  languages: Record<string, number>;
  commitsOverTime: { date: string; count: number }[];
  weeklyCommitCounts: number[];
  prCount: number;
  issueCount: number;
  reviewCount: number;
  heatmapData: ContributionDay[];
}

// Simple deterministic random generator based on a string seed (e.g., username)
function createSeededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function() {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// Generate realistic mock profile statistics for offline mode
export function generateMockProfile(username: string): ProfileData {
  const rand = createSeededRandom(username);
  const nextRandInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
  
  const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1);
  const profile: GitHubProfile = {
    username,
    name: `${formattedUsername} Developer`,
    avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    bio: `Passionate full-stack software engineer | building cool open-source projects with TS, Next.js, and PostgreSQL.`,
    followers: nextRandInt(80, 1500),
    following: nextRandInt(50, 400),
    publicRepos: nextRandInt(15, 60),
    createdAt: new Date(Date.now() - nextRandInt(31536000000 * 2, 31536000000 * 6)).toISOString(), // 2-6 years ago
  };

  const languagesList = ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'HTML', 'CSS'];
  const reposCount = profile.publicRepos;
  const repos: RepoDetails[] = [];
  const globalLanguages: Record<string, number> = {};

  for (let i = 0; i < reposCount; i++) {
    const isMajor = i < 3;
    const name = isMajor 
      ? ['core-compiler', 'nextjs-saas-kit', 'reactive-charts'][i] || `project-${i}`
      : `lib-utils-${i}`;
    const description = isMajor
      ? ['A high performance JS compiler written in Rust', 'Next.js boilerplate with Prisma and OAuth preconfigured', 'Beautiful reactive charts for dashboard layouts'][i]
      : `Utility functions and helpers library for ${languagesList[nextRandInt(0, languagesList.length - 1)]} systems.`;
    
    const stars = isMajor ? nextRandInt(250, 2500) : nextRandInt(2, 45);
    const forks = Math.round(stars * (rand() * 0.3 + 0.05));
    const openIssues = nextRandInt(0, 15);
    
    // Choose primary language
    const langIdx = isMajor ? i % 3 : nextRandInt(0, languagesList.length - 1);
    const primaryLang = languagesList[langIdx] || 'TypeScript';

    // Generate language sizes
    const repoLangs: Record<string, number> = { [primaryLang]: nextRandInt(10000, 150000) };
    if (rand() > 0.4) {
      const secondaryLang = languagesList[(langIdx + 1) % languagesList.length] || 'JavaScript';
      repoLangs[secondaryLang] = Math.round(repoLangs[primaryLang] * (rand() * 0.4));
    }
    
    // Add to global count
    Object.entries(repoLangs).forEach(([lang, size]) => {
      globalLanguages[lang] = (globalLanguages[lang] || 0) + size;
    });

    repos.push({
      name,
      owner: username,
      description,
      stars,
      forks,
      openIssues,
      language: primaryLang,
      languages: repoLangs,
      url: `https://github.com/${username}/${name}`,
      updatedAt: new Date(Date.now() - nextRandInt(0, 30) * 86400000).toISOString(),
    });
  }

  // Sort repos by stars
  repos.sort((a, b) => b.stars - a.stars);

  // Generate heatmap calendar data (365 days)
  const heatmapData: ContributionDay[] = [];
  const commitsOverTime: { date: string; count: number }[] = [];
  const oneDay = 24 * 60 * 60 * 1000;
  const now = new Date();
  
  // Create last 365 days
  for (let i = 365; i >= 0; i--) {
    const d = new Date(now.getTime() - i * oneDay);
    const dateStr = d.toISOString().split('T')[0] || '';
    
    // Weekend weight (fewer commits on weekends)
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    let count = 0;
    // Determine activity profile: quiet days, normal days, peak days
    const roll = rand();
    if (roll > 0.6) {
      count = isWeekend ? nextRandInt(1, 3) : nextRandInt(1, 8);
    } else if (roll > 0.92) {
      count = nextRandInt(8, 18); // Peak activity days
    }
    
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count > 0) {
      if (count <= 2) level = 1;
      else if (count <= 5) level = 2;
      else if (count <= 9) level = 3;
      else level = 4;
    }

    heatmapData.push({ date: dateStr, count, level });
    if (count > 0) {
      commitsOverTime.push({ date: dateStr, count });
    }
  }

  // Generate weekly commit counts (last 12 weeks)
  const weeklyCommitCounts: number[] = [];
  for (let w = 0; w < 12; w++) {
    let weekTotal = 0;
    for (let d = 0; d < 7; d++) {
      const dayIdx = (365 - (11 - w) * 7 - d);
      if (dayIdx >= 0 && dayIdx < heatmapData.length) {
        weekTotal += heatmapData[dayIdx]?.count || 0;
      }
    }
    weeklyCommitCounts.push(weekTotal);
  }

  // Calculate totals
  const totalCommits = heatmapData.reduce((sum, item) => sum + item.count, 0);
  const prCount = nextRandInt(Math.round(totalCommits * 0.1), Math.round(totalCommits * 0.25));
  const issueCount = nextRandInt(Math.round(prCount * 0.4), Math.round(prCount * 0.8));
  const reviewCount = nextRandInt(Math.round(prCount * 0.2), Math.round(prCount * 0.6));

  return {
    profile,
    repos,
    languages: globalLanguages,
    commitsOverTime,
    weeklyCommitCounts,
    prCount,
    issueCount,
    reviewCount,
    heatmapData,
  };
}

async function fetchGitHubUserDataGraphQL(username: string, token: string): Promise<ProfileData> {
  const query = `
    query($username: String!) {
      user(login: $username) {
        name
        login
        avatarUrl
        bio
        createdAt
        followers {
          totalCount
        }
        following {
          totalCount
        }
        repositories(first: 100, privacy: PUBLIC, orderBy: {field: STARGAZERS, direction: DESC}) {
          totalCount
          nodes {
            name
            description
            stargazerCount
            forkCount
            primaryLanguage {
              name
            }
            url
            updatedAt
          }
        }
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { username } }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL API returned status ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message || 'GraphQL query errors');
  }

  const gqlUser = json.data?.user;
  if (!gqlUser) {
    throw new Error(`User ${username} not found on GitHub.`);
  }

  const profile: GitHubProfile = {
    username: gqlUser.login,
    name: gqlUser.name || gqlUser.login,
    avatarUrl: gqlUser.avatarUrl,
    bio: gqlUser.bio || 'Developer on GitHub',
    followers: gqlUser.followers?.totalCount || 0,
    following: gqlUser.following?.totalCount || 0,
    publicRepos: gqlUser.repositories?.totalCount || 0,
    createdAt: gqlUser.createdAt,
  };

  interface GqlRepoNode {
    name: string;
    description: string | null;
    stargazerCount: number;
    forkCount: number;
    primaryLanguage: { name: string } | null;
    url: string;
    updatedAt: string;
  }

  const repos: RepoDetails[] = (gqlUser.repositories?.nodes || []).map((r: GqlRepoNode) => ({
    name: r.name,
    owner: username,
    description: r.description || '',
    stars: r.stargazerCount || 0,
    forks: r.forkCount || 0,
    openIssues: 0,
    language: r.primaryLanguage?.name || 'Markdown',
    languages: r.primaryLanguage?.name ? { [r.primaryLanguage.name]: 10000 } : {},
    url: r.url,
    updatedAt: r.updatedAt,
  }));

  const languages: Record<string, number> = {};
  repos.forEach(r => {
    if (r.language) {
      languages[r.language] = (languages[r.language] || 0) + 1;
    }
  });

  const heatmapData: ContributionDay[] = [];
  const levelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };

  interface GqlContributionDay {
    date: string;
    contributionCount: number;
    contributionLevel: string;
  }

  interface GqlContributionWeek {
    contributionDays: GqlContributionDay[];
  }

  const weeks = gqlUser.contributionsCollection?.contributionCalendar?.weeks || [];
  (weeks as GqlContributionWeek[]).forEach((week: GqlContributionWeek) => {
    const days = week.contributionDays || [];
    days.forEach((day: GqlContributionDay) => {
      heatmapData.push({
        date: day.date,
        count: day.contributionCount || 0,
        level: levelMap[day.contributionLevel] || 0,
      });
    });
  });

  const commitsOverTime = heatmapData
    .filter(d => d.count > 0)
    .map(d => ({ date: d.date, count: d.count }));

  const weeklyCommitCounts: number[] = [];
  const last84Days = heatmapData.slice(-84);
  for (let w = 0; w < 12; w++) {
    let weekTotal = 0;
    for (let d = 0; d < 7; d++) {
      const idx = w * 7 + d;
      weekTotal += last84Days[idx]?.count || 0;
    }
    weeklyCommitCounts.push(weekTotal);
  }

  return {
    profile,
    repos,
    languages: Object.keys(languages).length > 0 ? languages : { Markdown: 1 },
    commitsOverTime,
    weeklyCommitCounts,
    prCount: gqlUser.contributionsCollection?.totalPullRequestContributions || 0,
    issueCount: gqlUser.contributionsCollection?.totalIssueContributions || 0,
    reviewCount: gqlUser.contributionsCollection?.totalPullRequestReviewContributions || 0,
    heatmapData,
  };
}

export async function fetchGitHubUserData(username: string): Promise<ProfileData> {
  if (env.GITHUB_TOKEN) {
    try {
      console.log(`Fetching GraphQL contribution data for: ${username}`);
      return await fetchGitHubUserDataGraphQL(username, env.GITHUB_TOKEN);
    } catch (gqlErr) {
      console.warn('Failed to fetch from GitHub GraphQL API, falling back to REST:', gqlErr);
    }
  }

  // If GITHUB_TOKEN or similar client setup is configured, we can fetch real API:
  try {
    const headers: HeadersInit = {};
    if (env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${env.GITHUB_TOKEN}`;
    }

    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) {
      throw new Error(`User not found or GitHub API issue: ${userRes.status}`);
    }
    
    const user = await userRes.json();
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
    const rawRepos = reposRes.ok ? await reposRes.json() : [];

    interface GitHubApiRepo {
      name: string;
      owner: { login: string };
      description: string | null;
      stargazers_count: number;
      forks_count: number;
      open_issues_count: number;
      html_url: string;
      language: string | null;
      updated_at: string;
    }

    const repos: RepoDetails[] = (rawRepos as GitHubApiRepo[]).map((r) => ({
      name: r.name,
      owner: r.owner.login,
      description: r.description || '',
      stars: r.stargazers_count,
      forks: r.forks_count,
      openIssues: r.open_issues_count,
      language: r.language || 'Markdown',
      languages: r.language ? { [r.language]: 10000 } : {},
      url: r.html_url,
      updatedAt: r.updated_at,
    }));

    // Sort repos by stars
    repos.sort((a, b) => b.stars - a.stars);

    // Build standard language distribution
    const languages: Record<string, number> = {};
    repos.forEach(r => {
      if (r.language) {
        languages[r.language] = (languages[r.language] || 0) + 1;
      }
    });

    // Create a mock contribution set for the public fetch since calendar fetching requires GraphQL / OAuth Scopes
    // This merges real profile info + repo structures with structured calendar simulation
    const mockData = generateMockProfile(username);
    
    const realProfile: GitHubProfile = {
      username: user.login,
      name: user.name || user.login,
      avatarUrl: user.avatar_url,
      bio: user.bio || 'Developer on GitHub',
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      createdAt: user.created_at,
    };

    return {
      profile: realProfile,
      repos,
      languages: Object.keys(languages).length > 0 ? languages : mockData.languages,
      commitsOverTime: mockData.commitsOverTime,
      weeklyCommitCounts: mockData.weeklyCommitCounts,
      prCount: mockData.prCount,
      issueCount: mockData.issueCount,
      reviewCount: mockData.reviewCount,
      heatmapData: mockData.heatmapData,
    };
  } catch (error) {
    console.warn('Failed to fetch from GitHub API, falling back to rich mock engine:', error);
    return generateMockProfile(username);
  }
}
