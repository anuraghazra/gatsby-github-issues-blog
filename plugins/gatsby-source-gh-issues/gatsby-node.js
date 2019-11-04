"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var axios = require('axios');

exports.sourceNodes =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(context, options) {
    var actions, createNodeId, createContentDigest, reporter, createNode, REMOTE_API, githubIssuesData, issues, filteredissue, getMarkdown;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            actions = context.actions, createNodeId = context.createNodeId, createContentDigest = context.createContentDigest, reporter = context.reporter;
            createNode = actions.createNode;
            _context.prev = 2;
            // from a remote API.
            REMOTE_API = "https://api.github.com/repos/anuraghazra/circleci-test/issues?access_token=" + (process.env.GITHUB_TOKEN || '');
            _context.next = 6;
            return axios.get(REMOTE_API);

          case 6:
            githubIssuesData = _context.sent;
            issues = githubIssuesData.data;
            filteredissue = issues.filter(function (i) {
              if (!i.pull_request && i.state === 'open' && i.labels.some(function (label) {
                return label.name == 'blog';
              })) return true;
              return false;
            });

            getMarkdown = function getMarkdown(issue) {
              var title = issue.title,
                  body = issue.body,
                  created_at = issue.created_at,
                  labels = issue.labels,
                  number = issue.number;
              return "---\ntitle: \"" + title + "\"\ndate: \"" + created_at + "\"\n---\n\n" + body;
            }; // // Process data into nodes.
            // console.log(filteredissue)


            filteredissue.forEach(function (issue) {
              var markdownContent = getMarkdown(issue);
              createNode((0, _extends2.default)({}, issue, {
                id: createNodeId("github-issue-" + issue.id),
                parent: null,
                children: [],
                internal: {
                  type: 'GithubIssue',
                  mediaType: 'text/markdown',
                  content: markdownContent,
                  contentDigest: createContentDigest(issue)
                }
              }));
            });
            return _context.abrupt("return");

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](2);
            reporter.panic(_context.t0);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 14]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();