import yaml from 'js-yaml';
import { Octokit } from 'octokit';

export type GithubRepository = {
  owner: string;
  name: string;
};

type GithubIssueTemplate = {
  id: string;
  name: string;
  description?: string;
  labels?: string[];
  projects?: string[];
  assignees?: string[];
  body?: any;
};

/** @see https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content */
async function fetchIssueTemplateFileNames(github: Octokit, repo: GithubRepository) {
  let response: Awaited<ReturnType<typeof github.rest.repos.getContent>>;

  try {
    response = await github.rest.repos.getContent({
      owner: repo.owner,
      repo: repo.name,
      path: '.github/ISSUE_TEMPLATE',
      mediaType: {
        format: 'raw',
      },
    });
  } catch (error) {
    if (error.status === 404) return [];
    throw error;
  }

  // TODO: figure out why this is a thing
  if (!Array.isArray(response.data)) return [];

  return response.data
    .filter(
      (entity) =>
        entity.type === 'file' && (entity.path.endsWith('.yml') || entity.path.endsWith('.yaml')),
    )
    .map((file) => ({
      name: file.name as string,
      path: file.path as string,
      sha: file.sha as string,
      size: file.size as number,
      downloadUrl: file.download_url as string,
    }));
}

/**
 * Fetch the issue template, and configuration, from a GitHub repository.
 * This checks the `.github/ISSUE_TEMPLATE` directory for files ending in `.yml` or `.yaml`.
 *
 * @see https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository#configuring-the-template-chooser
 */
export async function fetchIssueTemplates(github: Octokit, repo: GithubRepository) {
  const files = await fetchIssueTemplateFileNames(github, repo);
  const contents = await Promise.allSettled(
    files.map((file) =>
      fetch(file.downloadUrl)
        .then((response) => response.text())
        .then((content) => yaml.load(content) as any),
    ),
  );

  const filesWithContent = contents.map((content, index) => ({
    ...files[index],
    content: content.status === 'fulfilled' ? content.value : undefined,
  }));

  const configFile = filesWithContent.find(
    (file) => file.name === 'config.yml' || file.name === 'config.yaml',
  );

  return {
    emptyIssuesEnabled: configFile?.content?.blank_issues_enabled ?? true,
    links: configFile?.content?.contact_links ?? [],
    templates: filesWithContent.filter((file) => file !== configFile),
  };
}

/**
 * Create the URL used to fill in a new issue, using optional template.
 *
 * @see https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository#creating-issue-forms
 */
export function createGithubIssueUrl(repo: GithubRepository, template?: GithubIssueTemplate) {
  const url = new URL(`https://github.com/${repo.owner}/${repo.name}/issues/new`);

  if (!template) return `${url}`;

  url.searchParams.append('template', template.id);

  if (template.labels?.length) {
    url.searchParams.append('labels', template.labels.join(','));
  }

  if (template.projects?.length) {
    url.searchParams.append('projects', template.projects.join(','));
  }

  if (template.assignees?.length) {
    url.searchParams.append('assignees', template.assignees.join(','));
  }

  return `${url}`;
}
