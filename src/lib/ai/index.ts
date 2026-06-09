import { ProfileData } from '../github';
import { ScoreBreakdown } from '../scoring';

export interface CoachingReport {
  summary: string;
  skillGaps: string[];
  repoImprovements: { repoName: string; suggestions: string[] }[];
  openSourceRecommendations: { title: string; tech: string; description: string; issueLevel: string }[];
  learningRoadmap: { phase: string; topic: string; details: string }[];
}

export interface ResumeData {
  bullets: string[];
  linkedinDesc: { projectName: string; description: string }[];
  profileReadme: string;
}

// Highly customized fallback generator when OpenAI key is absent
export function generateLocalCoachAdvice(data: ProfileData, score: ScoreBreakdown): CoachingReport {
  const primaryLangs = Object.keys(data.languages).slice(0, 3);
  const langString = primaryLangs.join(', ') || 'TypeScript/JavaScript';
  
  const skillGaps: string[] = [];
  const repoImprovements: CoachingReport['repoImprovements'] = [];
  const openSourceRecommendations: CoachingReport['openSourceRecommendations'] = [];
  const learningRoadmap: CoachingReport['learningRoadmap'] = [];

  // 1. Skill Gap Analysis
  if (!data.languages['Rust'] && !data.languages['Go'] && !data.languages['C++']) {
    skillGaps.push('Systems Languages: Introducing memory-efficient languages like Rust or Go could expand your capability in high-throughput backends.');
  }
  if (score.quality < 80) {
    skillGaps.push('Documentation Coverage: Several projects lack clear documentation. Adding setup guides and architecture logs is key to team collaboration.');
  }
  if (data.reviewCount < 5) {
    skillGaps.push('Collaborative Peer Reviews: Low code review activity. Reading and reviewing other developers\' PRs is critical for mid-to-senior engineering progression.');
  }
  if (data.heatmapData.filter(d => d.count > 0).length < 60) {
    skillGaps.push('Development Continuity: Commits are clustered in short bursts. Adopting a more consistent daily or weekly release cadence build habit and code quality.');
  }
  if (skillGaps.length === 0) {
    skillGaps.push('Advanced DevOps: Your coding profile is excellent. Consider exploring infrastructure-as-code (Terraform) or advanced GitHub Actions setups to round out your skillset.');
  }

  // 2. Repo Improvements
  const majorRepos = data.repos.slice(0, 2);
  majorRepos.forEach(repo => {
    const suggestions: string[] = [];
    if (!repo.description || repo.description.length < 15) {
      suggestions.push('Add an engaging 1-sentence tagline describing the core value proposition.');
    }
    suggestions.push('Integrate automated code-quality workflows (ESLint, Prettier, or GitHub Actions linter checks).');
    if (repo.stars > 100) {
      suggestions.push('Create a CONTRIBUTING.md file and issue templates to invite outside open-source contributors.');
    } else {
      suggestions.push('Add an API documentation markdown file or include a Swagger/OpenAPI specification if applicable.');
    }
    repoImprovements.push({ repoName: repo.name, suggestions });
  });

  if (repoImprovements.length === 0) {
    repoImprovements.push({
      repoName: 'General Repositories',
      suggestions: ['Ensure every repo contains a LICENSE file and a basic README with setup instructions.'],
    });
  }

  // 3. Open Source Recommendations
  if (primaryLangs.includes('TypeScript') || primaryLangs.includes('JavaScript')) {
    openSourceRecommendations.push({
      title: 'Next.js / React Ecosystem',
      tech: 'TypeScript, Tailwind CSS',
      description: 'Contribute to component optimization, routing documentation, or feature extensions in modern React stacks.',
      issueLevel: 'Good First Issue',
    });
  }
  if (primaryLangs.includes('Python')) {
    openSourceRecommendations.push({
      title: 'FastAPI / Django Integrations',
      tech: 'Python, PostgreSQL',
      description: 'Engage with backend issues, API route caching, or database model migrations on popular web frame libraries.',
      issueLevel: 'Medium Difficulty',
    });
  }
  openSourceRecommendations.push({
    title: 'Documentation & Developer Tooling',
    tech: 'Markdown, Node.js',
    description: 'Improve standard library guides, tutorial sections, or command line tool setups for developer packages.',
    issueLevel: 'Easy / Standard',
  });

  // 4. Learning Roadmap
  learningRoadmap.push({
    phase: 'Phase 1: Refined Testing (Weeks 1-3)',
    topic: 'Unit & Integration Tests',
    details: 'Focus on setting up Jest, Vitest, or PyTest inside your primary projects. Achieve 80%+ coverage metrics.',
  });
  learningRoadmap.push({
    phase: 'Phase 2: CI/CD Pipeline Setup (Weeks 4-6)',
    topic: 'Automated Deployments',
    details: 'Construct YAML files for GitHub actions that run tests and auto-deploy to platforms like Vercel or Docker Hub on branch merges.',
  });
  learningRoadmap.push({
    phase: 'Phase 3: Open Source Impact (Weeks 7-12)',
    topic: 'Upstream Contribution',
    details: 'Claim, resolve, and submit Pull Requests to 3 active libraries. Focus on clear review iterations.',
  });

  const summary = `Based on your score of ${score.overall}/100, you have strong fundamentals in ${langString}. Your principal growth vectors involve improving contribution consistency, establishing standard test metrics, and engaging in collaborative open-source reviews.`;

  return {
    summary,
    skillGaps,
    repoImprovements,
    openSourceRecommendations,
    learningRoadmap,
  };
}

export function generateLocalResumeData(data: ProfileData): ResumeData {
  const primaryLangs = Object.keys(data.languages).slice(0, 3).join(' and ');
  const majorRepos = data.repos.slice(0, 3);
  
  const bullets: string[] = [];
  const linkedinDesc: ResumeData['linkedinDesc'] = [];

  // Generate resume bullets
  majorRepos.forEach(repo => {
    const starText = repo.stars > 10 ? ` attracting ${repo.stars} stars and ${repo.forks} forks from the developer community` : '';
    bullets.push(
      `Engineered and published "${repo.name}", a developer tool focusing on ${repo.language},${starText} and implementing custom modules for scalability.`
    );
    
    linkedinDesc.push({
      projectName: repo.name,
      description: `Developed "${repo.name}" utilizing ${repo.language}. Features include: ${repo.description || 'scalable system endpoints'}. Optimized architecture to reduce query latency and structured database interactions with PostgreSQL.`,
    });
  });

  // Fallbacks if user has very few repos
  if (bullets.length === 0) {
    bullets.push(`Full-stack developer with experiences in ${primaryLangs || 'TypeScript'}, architecting web modules using responsive frameworks.`);
  }

  // Profile readme template
  const repoShowcase = majorRepos.map(r => `- **[${r.name}](${r.url})**: ${r.description || 'A software project.'} (${r.language})`).join('\n');
  const profileReadme = `# Hi, I'm ${data.profile.name}! 👋

A passionate software engineer specializing in **${primaryLangs || 'TypeScript/JavaScript'}**. I focus on code efficiency, documentation quality, and writing clean, maintainable systems.

## 📊 Analytics Summary
* 💻 **Languages**: ${Object.keys(data.languages).slice(0, 5).join(', ')}
* 🚀 **Open Source Score**: Active contributor with PR and Issue tracking
* 🛠️ **Public Projects**: Showcase repos with testing pipelines

## 📁 Projects Showcase
${repoShowcase}

---
*Generated automatically by Contribix Developer Hub*`;

  return {
    bullets,
    linkedinDesc,
    profileReadme,
  };
}

// Calls OpenAI if key is present, otherwise falls back to local rules-based engine
export async function getAICoachingAdvice(data: ProfileData, score: ScoreBreakdown, userPrompt?: string): Promise<CoachingReport & { chatResponse?: string }> {
  const localAdvice = generateLocalCoachAdvice(data, score);

  if (!process.env.OPENAI_API_KEY) {
    // If there's a custom chat question, generate a realistic response
    let chatResponse: string | undefined;
    if (userPrompt) {
      const promptLower = userPrompt.toLowerCase();
      if (promptLower.includes('languages') || promptLower.includes('learn')) {
        chatResponse = `To expand your skills from your current stack of ${Object.keys(data.languages).slice(0, 3).join(', ')}, I recommend learning **Go** or **Rust** next. Go will strengthen your concurrency and backend engineering, while Rust will help you understand memory models, systems development, and compile-time correctness. Start by implementing a simple CLI tool or backend server in one of them!`;
      } else if (promptLower.includes('readiness') || promptLower.includes('job') || promptLower.includes('internship')) {
        chatResponse = `Your overall developer score is ${score.overall}/100. To maximize your readiness for internships, focus heavily on 'Quality' and 'Open Source' scores. Ensure your target portfolio projects have at least 80% test coverage, a detailed architecture doc in the README, and at least one contribution to a shared upstream repository. This shows recruiters you can work in a team environment immediately.`;
      } else {
        chatResponse = `I've analyzed your profile metrics. Your activity consistency is currently at ${Math.round(score.activity)}/100, and your codebase quality stands at ${Math.round(score.quality)}/100. My primary advice is to establish a habit of committing 3-4 days a week instead of in single large bursts, and ensuring each project repository has automated linting pipelines set up. Let me know if you want detailed suggestions for any specific repo.`;
      }
    }
    return { ...localAdvice, chatResponse };
  }

  try {
    const messages = [
      {
        role: 'system',
        content: `You are Contribix AI Coach, an expert developer consultant and tech recruiter. You analyze a developer's GitHub telemetry and scores to provide professional, specific, and actionable career advice. Return a strict JSON response matching the following typescript type:
        {
          summary: string;
          skillGaps: string[];
          repoImprovements: { repoName: string, suggestions: string[] }[];
          openSourceRecommendations: { title: string, tech: string, description: string, issueLevel: string }[];
          learningRoadmap: { phase: string, topic: string, details: string }[];
          chatResponse?: string;
        }
        Do not output any markdown code blocks (like \`\`\`json) outside of the raw JSON content unless requested. Return strictly valid JSON.`
      },
      {
        role: 'user',
        content: `Here is the developer profile telemetry:
        Username: ${data.profile.username}
        Followers: ${data.profile.followers}
        Total Commits (Last Year): ${data.heatmapData.reduce((sum, d) => sum + d.count, 0)}
        Languages Used: ${JSON.stringify(data.languages)}
        Open Source PRs: ${data.prCount}, Issues: ${data.issueCount}, Reviews: ${data.reviewCount}
        Repositories: ${JSON.stringify(data.repos.map(r => ({ name: r.name, stars: r.stars, forks: r.forks, language: r.language, description: r.description })))}
        Scores: Overall=${score.overall}, Activity=${score.activity}, Quality=${score.quality}, OpenSource=${score.openSource}, Community=${score.community}
        ${userPrompt ? `User's question: "${userPrompt}"` : ''}`
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API returned status ${response.status}`);
    }

    const result = await response.json();
    const parsed = JSON.parse(result.choices[0].message.content);
    return parsed;
  } catch (error) {
    console.error('Failed call to OpenAI API, falling back to local advice engine:', error);
    return localAdvice;
  }
}
