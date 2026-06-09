import { ProfileData } from '../github';

export interface ScoreBreakdown {
  overall: number;
  activity: number;
  quality: number;
  openSource: number;
  community: number;
  audits: {
    category: 'activity' | 'quality' | 'openSource' | 'community';
    title: string;
    description: string;
    passed: boolean;
    scoreImpact: number;
  }[];
}

export function calculateDeveloperScore(data: ProfileData): ScoreBreakdown {
  const audits: ScoreBreakdown['audits'] = [];
  
  // 1. ACTIVITY SCORE (30% weight)
  // Commits weight (60% of activity): target is 400 commits/year
  const totalCommits = data.heatmapData.reduce((sum, d) => sum + d.count, 0);
  const commitScore = Math.min(100, Math.round((totalCommits / 400) * 100));
  
  // Consistency weight (40% of activity): target is 120 active days/year
  const activeDays = data.heatmapData.filter(d => d.count > 0).length;
  const consistencyScore = Math.min(100, Math.round((activeDays / 120) * 100));
  
  const activityScore = Math.round(commitScore * 0.6 + consistencyScore * 0.4);
  
  audits.push({
    category: 'activity',
    title: 'Commit Volume',
    description: `You made ${totalCommits} commits in the past year (target: 400 for maximum score).`,
    passed: totalCommits >= 250,
    scoreImpact: totalCommits >= 400 ? 0 : Math.round((1 - totalCommits / 400) * 15),
  });

  audits.push({
    category: 'activity',
    title: 'Contribution Consistency',
    description: `You committed on ${activeDays} days this year. Regular streaks boost consistency scores.`,
    passed: activeDays >= 80,
    scoreImpact: activeDays >= 120 ? 0 : Math.round((1 - activeDays / 120) * 10),
  });

  // 2. QUALITY SCORE (20% weight)
  // Repository completeness: descriptions, documentation index
  const repos = data.repos;
  const reposWithDesc = repos.filter(r => r.description && r.description.length > 5).length;
  const descRatio = repos.length > 0 ? reposWithDesc / repos.length : 1;
  const descScore = Math.round(descRatio * 100);

  // Multi-language versatility
  const langCount = Object.keys(data.languages).length;
  const languageVersatilityScore = Math.min(100, langCount * 15 + 20); // 5+ languages gets ~95

  const qualityScore = Math.round(descScore * 0.5 + languageVersatilityScore * 0.5);

  audits.push({
    category: 'quality',
    title: 'Repository Descriptions',
    description: `${reposWithDesc} of your ${repos.length} public repositories have descriptions. Complete summaries improve discoverability.`,
    passed: descRatio >= 0.75,
    scoreImpact: Math.round((1 - descRatio) * 12),
  });

  audits.push({
    category: 'quality',
    title: 'Language Breadth',
    description: `You work across ${langCount} programming languages. Broad stacks display strong adaptability.`,
    passed: langCount >= 4,
    scoreImpact: langCount >= 5 ? 0 : (5 - langCount) * 4,
  });

  // 3. OPEN SOURCE SCORE (30% weight)
  // PRs target: 30 PRs/year
  const prScore = Math.min(100, Math.round((data.prCount / 30) * 100));
  // Issues target: 15 Issues/year
  const issueScore = Math.min(100, Math.round((data.issueCount / 15) * 100));
  // Reviews target: 10 reviews/year
  const reviewScore = Math.min(100, Math.round((data.reviewCount / 10) * 100));

  const openSourceScore = Math.round(prScore * 0.5 + issueScore * 0.3 + reviewScore * 0.2);

  audits.push({
    category: 'openSource',
    title: 'Pull Requests Created',
    description: `You opened ${data.prCount} Pull Requests. PRs are the foundation of collaborative code contribution.`,
    passed: data.prCount >= 15,
    scoreImpact: data.prCount >= 30 ? 0 : Math.round((1 - data.prCount / 30) * 15),
  });

  audits.push({
    category: 'openSource',
    title: 'Issue Tracker Activity',
    description: `You engaged in ${data.issueCount} issue threads. Issue communication is essential for scope planning.`,
    passed: data.issueCount >= 8,
    scoreImpact: data.issueCount >= 15 ? 0 : Math.round((1 - data.issueCount / 15) * 8),
  });

  audits.push({
    category: 'openSource',
    title: 'Code Reviews Conducted',
    description: `You completed ${data.reviewCount} code reviews. Reviewing peers demonstrates tech leadership.`,
    passed: data.reviewCount >= 5,
    scoreImpact: data.reviewCount >= 10 ? 0 : Math.round((1 - data.reviewCount / 10) * 7),
  });

  // 4. COMMUNITY SCORE (20% weight)
  // Total stars: target 150 stars across repos
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const starScore = Math.min(100, Math.round((totalStars / 150) * 100));

  // Followers: target 100 followers
  const followerScore = Math.min(100, Math.round((data.profile.followers / 100) * 100));

  const communityScore = Math.round(starScore * 0.6 + followerScore * 0.4);

  audits.push({
    category: 'community',
    title: 'Star Popularity',
    description: `Your repositories accrued ${totalStars} stars total (target: 150).`,
    passed: totalStars >= 50,
    scoreImpact: totalStars >= 150 ? 0 : Math.round((1 - totalStars / 150) * 12),
  });

  audits.push({
    category: 'community',
    title: 'Developer Followership',
    description: `You have ${data.profile.followers} followers on GitHub. Social footprints indicate domain authority.`,
    passed: data.profile.followers >= 30,
    scoreImpact: data.profile.followers >= 100 ? 0 : Math.round((1 - data.profile.followers / 100) * 8),
  });

  // 5. OVERALL WEIGHTED SCORE
  // Activity: 30%, Quality: 20%, Open Source: 30%, Community: 20%
  const overall = Math.round(
    activityScore * 0.3 +
    qualityScore * 0.2 +
    openSourceScore * 0.3 +
    communityScore * 0.2
  );

  return {
    overall,
    activity: activityScore,
    quality: qualityScore,
    openSource: openSourceScore,
    community: communityScore,
    audits,
  };
}
