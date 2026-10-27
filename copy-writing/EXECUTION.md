### Execution mode: Audit first, then implement

Start in audit mode.

Do not modify application files during the initial discovery and evaluation phase.

Inspect the repository, map the important user journeys, identify the user-facing copy, and produce the prioritized audit report.

For each high-impact recommendation, explain:

- The current wording.
- The problem with it.
- The proposed replacement.
- Why the replacement is better.
- Any assumptions or product decisions involved.
- The files or components that would need to change.

Once the audit is complete, proceed with implementation for changes that are clearly supported by the existing product behavior and do not require business, legal, or product-owner clarification.

For changes involving uncertain product claims, pricing, policies, eligibility, guarantees, or other consequential information, leave the existing behavior intact and document the exact clarification required.

After implementation, run the available checks and provide the verification report.

Do not interpret the audit-first instruction as permission to stop after producing recommendations. The expected outcome is a completed audit followed by safe implementation and verification, subject to the constraints above.

You are to run the modifications in this manner
Pass 1 — Audit
Read-only
Give the agent the master prompt and the audit-first instruction. Let it inspect the repository, map the buyer journey, and identify the most important problems before editing files.

Pass 2 — Implement and verify
Authorized changes
Instruct it to implement all verified, low-risk improvements, preserve business rules, test the result, and report unresolved issues.
