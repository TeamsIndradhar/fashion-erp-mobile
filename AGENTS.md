# Agent instructions — Fashion ERP Mobile

This repository follows a **documentation-first, approval-gated** process. These rules apply to every AI agent (Codex, Claude Code, Antigravity, others):

1. Before any work, read `docs/13_AI_AGENT_WORKFLOW.md`, `docs/14_MOBILE_PROJECT_STATUS.md` and `docs/12_DECISION_LOG.md`.
2. Work through the phases in `docs/11_IMPLEMENTATION_ROADMAP.md` in order. **D-039 (user, 2026-11-03): no phase gates — continue to the next phase and push to `main` without waiting;** stop only for inputs only the user can give (photos, accounts, phones, site visit) and list them in `docs/14`.
3. Ask the user when a decision is not already approved. Never redesign approved architecture or expand scope on your own.
4. Backend changes belong in the `fashion-erp` repository and follow its `CLAUDE.md`.
5. UI work: follow `design/design-system/`, the screen inventory (`design/screen-inventory/`) and only **approved** mockups (`design/approvals/APPROVED_SCREENS.md`). Never change the theme or a shared component without a change request.
6. Never commit secrets. Report incomplete or failed work honestly.
