# 🔨 Contributing to LifeForge

> [!WARNING]
> Since LifeForge is currently in early and active development, the guidelines below may change frequently. Before you post your issues, please check back here to ensure you're following the latest contribution practices.

Thank you for being part of the LifeForge community, where we forge codes together while we are forging our lives. We always welcome contributions from everyone, whether you're a seasoned developer or a newcomer to open source.

## Table of Contents
- [Where to Report Issues?](#where-to-report-issues)
- [How to Report Issues?](#how-to-report-issues)
  - [Prepare to Report](#prepare-to-report)
  - [Writing the Issue](#writing-the-issue)
  - [Validating Your Issue](#validating-your-issue)
	- [Is the description itself is clear and sufficient?](#is-the-description-itself-is-clear-and-sufficient)
	- [Is the issue is related to NON-OFFICIAL MODULES?](#is-the-issue-is-related-to-non-official-modules)
	- [Is your issue only related to a SINGLE problem?](#is-your-issue-only-related-to-a-single-problem)
	- [Is the issue is important? Is anyone really depends on it? (for feature requests)](#is-the-issue-is-important-is-anyone-really-depends-on-it-for-feature-requests)
	- [Am I okay with my issue being closed if it doesn't meet the guidelines?](#am-i-okay-with-my-issue-being-closed-if-it-doesnt-meet-the-guidelines)
	- [Am I okay to communicate/engage/share further about the issues?](#am-i-okay-to-communicateengageshare-further-about-the-issues)
- [POLICY ON AI-GENERATED CONTENT](#policy-on-ai-generated-content)


# Where to Report Issues?
For any bugs, feature requests, or possible enhancements, please do ONLY open an issue on our [GitHub Issues Page](https://github.com/lifeforge/lifeforge-app/issues), except the following circumstances:

- If your issue is security-related, please make a private email to us.
- For any other reason (i.e You may not able to open an issue on GitHub), please contact us via email.

# How to Report Issues?
> [!TIP]
> Some issues may have already discovered by other users. Before you open a new issue, please search on the [Issues Page](https://github.com/lifeforge/lifeforge-app/issues) to see if your issue has already been reported.

## Prepare to Report
When reporting an issue, please ask yourself the following questions:

- Is the issue specific to my environment or configuration? (i.e. you're using incompatible platforms or OSes)
- If that a single step is missing while following the docs?
- Is the issue already reported by other users?

If any other of the above questions apply, you may need to follow our official documentation at first.

> [!TIP]
> If you're unsure whether your issue is valid, you're always welcomed to create an issue. However, if you are not able to follow any of the guidelines, we might close the issue until more information is provided.

## Writing the Issue
When writing the issue, please include the following information:
1. **Description**: A detailed description of the issue, including:
   - Steps to reproduce the issue.
   - Expected behaviour.
   - Actual behaviour.
   - How could it be fixed/enhanced?
   - What is the expected outcome of the solution?
2. **Environment**: Information about your environment, such as:
   - Operating System (e.g., Windows 10, macOS 11.2, Ubuntu 20.04)
   - LifeForge version (e.g., v0.1.0)
   - Installed/enabled extensions (if applicable).
   - Any relevant configurations or settings.
3. **Screenshots/Logs**: If applicable, include screenshots or log files that help

> [!WARNING]
> Please DO NOT include screenshots of log. Instead copy and paste the relevant log entries directly into the issue for better readability.
> For NON-OFFICIAL MODULES, please contact the module developer for support.

**COPY THE ISSUE TEMPLATE BELOW:**

```markdown
**Is this a bug report or a feature request?** (choose one):
- [ ] Bug Report
- [ ] Feature Request

**This bug occurs on**
- [ ] Server
- [ ] Client
- [ ] Extensions
- [ ] Other (please specify): 

___

**Description:**
1. Steps to reproduce the issue:
   - Step 1:
   - Step 2:
   - Step 3:
   - ...

2. Expected behaviour:

3. Actual behaviour:

4. How could it be fixed/enhanced? 

5. What is the expected outcome of the solution?

**Environment:**
- Operating System:
- LifeForge Version:
- Relevant Configurations/Settings:
**Screenshots/Logs:**
<!-- Attach your logs/screenshots here --> illustrate the issue.

**I have fully understand the contribution guidelines. I hereby understand that if I violates any section of the contribution guidelines, my issue may be closed and ignored.** (please check one):
- [ ] Yes
```

**CONTINUE READING BELOW TO ENSURE YOUR ISSUE IS VALID**

## Validating Your Issue
Before and after writing your issue, please take a moment to review it and ensure that it meets the following criteria.

> [!WARNING]
> Many people often overlook this section, which may lead to their issues being closed without further notice. Please make sure to read through this section carefully.

### Is the description itself is clear and sufficient?

Many open source project often receive large amount of issues that appears to be vague, which makes it hard for maintainers to reproduce and fix them. To make sure that your issue is clear enough, please read through your description and ask yourself:
- What _actually_ the problem is?
- How it can be reproduced?
- What is the expected outcome?
- What is the actual outcome?
- How is the solution will look like?

If you can answer all of the above questions clearly in your issue description, then your issue is clear enough.

Some examples of bad issues that you MUST avoid: 
1.  **Bad description**: "LifeForge crashes when I open it." (perhaps, asks yourself what is the _specific_ step that causes a crash?)

2. **Incompatible environment**: "I couldn't install LifeForge on my Windows machine." (NOTE: If you're using WSL, please take note on which distribution you're using, and whether it's supported by LifeForge)

3. **Missing steps**: "In the settings after clicking save, there are nothing happens." (Sometimes, the problem often caused by some edge cases, for example, the bug occurs after enabling a specific settings, or maybe after a browser refresh, or Internet disconnecton, etc. So make sure to include all the steps that lead to the problem)

4. **Already reported**: "There is a (some common issue)." (Please search on the Issues Page first to see if your issue has already been reported)

5. **Already fixed**: "There is a bug in version 0.1.0." (Please make sure that you're using the latest version of LifeForge before reporting an issue)

> [!TIP]
> If you realized that your issue description is only 2-3 lines/steps long, please take a moment to re-evaluate your issue and see if you can provide more details.

### Is the issue is related to NON-OFFICIAL MODULES?

As LifeForge is an open platform that allows third-party modules, some issues may be caused by NON-OFFICIAL modules. 

If you suspect that your issue is caused by a NON-OFFICIAL module, please contact the module developer for support. We may not able to provide support for issues caused by NON-OFFICIAL modules.

However, if you're developing a module and you believe that the issue is caused by a bug in LifeForge core, please provide some extra information about
- What the module does
- How the module interacts with LifeForge core
- Any relevant code snippets that may help us to reproduce the issue

### Is your issue only related to a SINGLE problem?

Sometimes, users may face multiple issues at the same time. However, to make our tasks easier, please report each issue separately.

For example, if you're facing **both a bug and a feature request**, please create two separate issues for each of them.

> [!TIP]
> To better understand whether the issues are separate, please try to see whether the issues can be reproduced independently. If they can, then they are separate issues.

### Is the issue is important? Is anyone really depends on it? (for feature requests)

This can be a tricky question, but it's important to consider whether the feature you're requesting is something that will benefit a significant number of users.

Before making a feature request, check on what does LifeForge did, and what is the main purpose of the project. If your feature request aligns with the project's goals and has a clear use case, it's more likely to be considered.

> [!TIP]
> If you're ambitious about a feature request, but you think it is not much related, consider develop it and release it as a third-party module instead.

### Am I okay with my issue being closed if it doesn't meet the guidelines?

As a developer, we might have our own priorities and limitations. If your issue doesn't meet the guidelines above, we may not able to address it immediately, or we might have to close it until more information is provided.

To make sure we don't get into unnecessary conflicts, please ensure that you're okay with your issue being closed if it doesn't meet the guidelines.

### Am I okay to communicate/engage/share further about the issues?

To better understand and address your issue, we might need to ask you for more information or clarification regarding your issue/feature requests. 

By engaging with us, you're having chance to have your request to be more likely to be addressed correctly.

> [!WARNING]
> Sometimes, we may ask you to share some sensitive information (e.g., logs, configurations, etc.) to help us diagnose the issue. Please ensure that you're comfortable with sharing such information before proceeding.

# POLICY ON AI-GENERATED CONTENT

> [!WARNING]
> Please make your you have read and understood this section carefully, as it is about our stance towards AI-generated content. 

As a ~~former vibe coder~~ active Generative AI user, we understand the convenience of using AI tools (i.e. CoPilot, ChatGPT, Antigravity, Cursor, etc.) to help you write code or docs. However, from the start of this project, we realized that using agentic AI tools to write code (i.e. vibe-coding) may lead to various issues, such as:
- Security vulnerabilities
- Licensing conflicts
- Ethical concerns
- Quality issues

This is a critical issue in open source projects, and we want to make sure that our project is clean from such issues.

Including this guidelines, we are strongly aware of generative AI usage in our project, to keep our project safe, secure and high-quality. Furthermore, this project may handle sensitive user data, and we want to ensure that our codebase is free from any potential risks that may arise from AI-generated content.

Therefore, we have the following policies regarding AI-generated content:

1. If you have used AI tools to generate any part of your contribution (code, docs, etc. including prettifying, refactoring), you MUST clearly disclose the following information:
	- Which AI tool(s) you have used (with the specific model/version if applicable)
	- What part of your contribution is AI-generated
	- How you have verified the correctness, security, and quality of the AI-generated content

**APPEND THIS TEMPLATE BELOW IN YOUR ISSUES**
```markdown
**AI-Generated Content Declaration:**
- AI Tool(s) Used:
	- [ ] Tool 1: (e.g., ChatGPT, GitHub Copilot, etc.)
	- [ ] Tool 2:
	- [ ] Tool 3:

- AI Model(s)/Version(s) Used:
	- [ ] Model 1: (e.g., GPT-5.2, Codex, Claude Sonnet, etc.)
	- [ ] Model 2:
	- [ ] Model 3:

- Part of Contribution that is AI-Generated:
	- [ ] path/to/file1.ext (line xx-yy, or whole file if applicable)
	- [ ] path/to/file2.ext (line xx-yy)
	- [ ] Documentation in path/to/docfile.ext (section xx-yy)

- Verification Steps:
	1. Step 1: (e.g., Manual code review, unit tests, etc.)
	2. Step 2:
	3. Step 3:

**I have fully understand the AI-generated content policy. I hereby declare that the above information is accurate and complete. I understand that my pull requests may be rejected if this declaration is found to be false or incomplete.** (please check one):
- [ ] Yes
```

**We reserve the right to review and verify any AI-generated content in your contribution. If we find any issues (e.g., security vulnerabilities, licensing conflicts, etc.), we may request you to fix them or reject your contribution.**

> [!TIPS]
> To make sure that your AI-generated content is safe and high-quality, consider the following best practices:
> - Always review and test the AI-generated content thoroughly before submitting it. 
> - Make sure you understand what every line of your code really does. If you find yourself hard to explain, **DON'T PERFORM THE PULL REQUEST!** (we might not able to comprehend it either)
> - Use multiple AI tools to cross-verify the generated content.
> - Ultimately, use custom instructions or prompt engineering technique to guide the AI tool to generate content that aligns with our project's standards and guidelines.

# Developer's Note
This part is still under development. Please check back later for updates.

For the module development guidelines, please check the [Module Development Guidelines](https://docs.lifeforge.dev/developer-guide/modules) document.