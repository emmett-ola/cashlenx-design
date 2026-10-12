# CashLenX Design

## Archived

This repository was archived on 2026-10-12. It preserves the early
Figma-exported React/Vite product prototype and is no longer maintained as a
parallel UI implementation or current visual authority.

Current UI behavior and presentation are owned by
[cashlenx-app](https://github.com/emmett-ola/cashlenx-app). Product rules,
delivery workflow, and durable design decisions are owned by
[cashlenx-spec](https://github.com/emmett-ola/cashlenx-spec). This prototype may
still be consulted as historical evidence, but new work must not require parity
with it.

The original design project is available in
[Figma](https://www.figma.com/design/Zk98sZ5w9YVOZlTR0AARV8/CashLenX-Design).

## CashLenX Project

CashLenX is developed as a set of independently buildable repositories with
explicit ownership boundaries:

| Repository | Responsibility |
| --- | --- |
| [cashlenx-app](https://github.com/emmett-ola/cashlenx-app) | Cross-platform Flutter client and user experience. |
| [cashlenx-server](https://github.com/emmett-ola/cashlenx-server) | Go REST API, Cobra CLI, authentication, finance services, and MongoDB/MySQL persistence. |
| [cashlenx-design](https://github.com/emmett-ola/cashlenx-design) | Archived early product prototype retained as historical evidence. |
| [cashlenx-website](https://github.com/emmett-ola/cashlenx-website) | Public product and developer-information website. |
| [cashlenx-spec](https://github.com/emmett-ola/cashlenx-spec) | Product and system facts, delivery workflow, decisions, and retained evidence. |

The design bundle is not a runtime dependency of the application.

## Running the Code

```bash
npm install
npm run dev
```

## Contributing And Security

- [Contribution Guide](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Shared Governance](https://github.com/emmett-ola/cashlenx-spec/blob/main/GOVERNANCE.md)
- [Shared Delivery Workflow](https://github.com/emmett-ola/cashlenx-spec/blob/main/WORKFLOW.md)

## License

This project is licensed under the [MIT License](LICENSE). Commercial use,
modification, and redistribution are permitted when the copyright and license
notices are retained.
