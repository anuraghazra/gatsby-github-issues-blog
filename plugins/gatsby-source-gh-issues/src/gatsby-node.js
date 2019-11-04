const axios = require('axios');
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

exports.sourceNodes = async (context, options) => {
  const { actions, createNodeId, createContentDigest, reporter } = context;
  const { createNode } = actions;
  const { repo, user, filterByLabelName } = options;

  try {
    const REMOTE_API = `https://api.github.com/repos/${user}/${repo}/issues?access_token=${process.env.GITHUB_TOKEN || ''}`
    const githubIssuesData = await axios.get(REMOTE_API)
    let issues = githubIssuesData.data;

    let filteredissue = issues.filter(i => {
      if (
        !i.pull_request
        && i.state === 'open'
        && i.labels.some((label) => label.name == filterByLabelName)
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