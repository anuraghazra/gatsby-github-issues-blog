const axios = require('axios');

exports.sourceNodes = async (context, options) => {
  const { actions, createNodeId, createContentDigest, reporter } = context;
  const { createNode } = actions;

  try {

    // from a remote API.
    const REMOTE_API = `https://api.github.com/repos/anuraghazra/circleci-test/issues?access_token=${process.env.GITHUB_TOKEN || ''}`
    const githubIssuesData = await axios.get(REMOTE_API)
    let issues = githubIssuesData.data;

    let filteredissue = issues.filter(i => {
      if (
        !i.pull_request
        && i.state === 'open'
        && i.labels.some((label) => label.name == 'blog')
      ) return true;
      return false;
    })

    const getMarkdown = (issue) => {
      const { title, body, created_at, labels, number } = issue;
      return `---\ntitle: "${title}"\ndate: "${created_at}"\n---\n\n${body}`;
    }

    // // Process data into nodes.
    // console.log(filteredissue)
    filteredissue.forEach(issue => {
      const markdownContent = getMarkdown(issue);
      createNode(
        {
          ...issue,
          id: createNodeId(`github-issue-${issue.id}`),
          parent: null,
          children: [],
          internal: {
            type: 'GithubIssue',
            mediaType: 'text/markdown',
            content: markdownContent,
            contentDigest: createContentDigest(issue),
          },
        }
      )
    });

    return;
  } catch (err) {
    reporter.panic(err);
  }
}