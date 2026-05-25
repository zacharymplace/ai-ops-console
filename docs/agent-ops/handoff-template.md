# Claude Handoff Template

Use this template when handing a specific implementation task to Claude.

Read CLAUDE.md and README.md first.

Task:
[Describe the exact change.]

Constraints:
- Keep the diff small.
- Do not change unrelated files.
- Do not change classifier categories unless explicitly required.
- Do not change persistence or audit behavior.
- Do not add dependencies unless necessary and justified.

Validation:
- npm run agent:preflight
- npm run release:ready

Output:
- Summary
- Files changed
- Validation results
- Risks
- Next recommended patch

Do not push.
