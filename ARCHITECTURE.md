# ZAPASNO Architecture

ZAPASNO keeps product rules outside the UI.

- `src/domain`: framework-independent preparedness models, scenarios, and planning engine.
- `src/application`: orchestration that turns user answers into an assessment and personal action plan.
- `src/infrastructure`: replaceable adapters such as browser localStorage persistence.
- `src/app`: Next.js App Router presentation and interaction layer.
