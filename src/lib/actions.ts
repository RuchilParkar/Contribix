'use server';

import { prisma } from './prisma';

// Helper to catch database errors and return a custom offline flag
async function handleDbCall<T>(fn: () => Promise<T>): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error: any) {
    console.warn('Database operation failed, falling back to client-side localStorage:', error.message || error);
    return { success: false, error: 'DB_OFFLINE' };
  }
}

// User setup/sync
export async function getOrCreateUser(username: string, name?: string, avatarUrl?: string) {
  return handleDbCall(async () => {
    return await prisma.user.upsert({
      where: { username },
      update: { name, avatarUrl },
      create: {
        githubId: `mock-${username}-${Math.floor(Math.random() * 100000)}`,
        username,
        name: name || username,
        avatarUrl,
      },
    });
  });
}

// Tracked Repositories
export async function saveTrackedRepository(
  userId: string,
  owner: string,
  name: string,
  description?: string,
  stars = 0,
  forks = 0,
  openIssues = 0
) {
  return handleDbCall(async () => {
    return await prisma.trackedRepository.upsert({
      where: {
        userId_owner_name: { userId, owner, name },
      },
      update: { description, stars, forks, openIssues, lastSyncedAt: new Date() },
      create: { userId, owner, name, description, stars, forks, openIssues },
    });
  });
}

export async function getTrackedRepositories(userId: string) {
  return handleDbCall(async () => {
    return await prisma.trackedRepository.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  });
}

export async function removeTrackedRepository(id: string) {
  return handleDbCall(async () => {
    return await prisma.trackedRepository.delete({
      where: { id },
    });
  });
}

// Contribution Snapshots
export async function saveContributionSnapshots(
  userId: string,
  snapshots: { date: Date; commits: number; prs: number; issues: number; reviews: number }[]
) {
  return handleDbCall(async () => {
    const promises = snapshots.map((s) =>
      prisma.contributionSnapshot.upsert({
        where: {
          userId_date: { userId, date: s.date },
        },
        update: { commits: s.commits, prs: s.prs, issues: s.issues, reviews: s.reviews },
        create: { userId, date: s.date, commits: s.commits, prs: s.prs, issues: s.issues, reviews: s.reviews },
      })
    );
    return await Promise.all(promises);
  });
}

// Developer Score
export async function saveDeveloperScore(
  userId: string,
  overall: number,
  activity: number,
  quality: number,
  openSource: number,
  community: number
) {
  return handleDbCall(async () => {
    return await prisma.developerScore.create({
      data: {
        userId,
        overallScore: overall,
        activityScore: activity,
        qualityScore: quality,
        openSourceScore: openSource,
        communityScore: community,
      },
    });
  });
}

export async function getDeveloperScores(userId: string) {
  return handleDbCall(async () => {
    return await prisma.developerScore.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  });
}

// Coaching Reports
export async function saveCoachingReport(
  userId: string,
  summary: string,
  recommendations: any,
  gaps: any
) {
  return handleDbCall(async () => {
    return await prisma.coachingReport.create({
      data: {
        userId,
        summary,
        recommendations: JSON.stringify(recommendations),
        gaps: JSON.stringify(gaps),
      },
    });
  });
}

export async function getCoachingReports(userId: string) {
  return handleDbCall(async () => {
    return await prisma.coachingReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  });
}

// Resume Generations
export async function saveResumeGeneration(
  userId: string,
  bulletPoints: any,
  linkedinDesc: string,
  readmeContent: string
) {
  return handleDbCall(async () => {
    return await prisma.resumeGeneration.create({
      data: {
        userId,
        bulletPoints: JSON.stringify(bulletPoints),
        linkedinDesc,
        readmeContent,
      },
    });
  });
}

// Readiness Reports
export async function saveReadinessReport(
  userId: string,
  overallScore: number,
  missingSkills: any,
  roadmap: any
) {
  return handleDbCall(async () => {
    return await prisma.readinessReport.create({
      data: {
        userId,
        overallScore,
        missingSkills: JSON.stringify(missingSkills),
        roadmap: JSON.stringify(roadmap),
      },
    });
  });
}
