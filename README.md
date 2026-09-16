# CashLenX Design

CashLenX Design is the Figma-exported React/Vite visual and interaction
reference for CashLenX. The original design project is available in
[Figma](https://www.figma.com/design/Zk98sZ5w9YVOZlTR0AARV8/CashLenX-Design).

## CashLenX Project

CashLenX is developed as a set of independently buildable repositories with
explicit ownership boundaries:

| Repository | Responsibility |
| --- | --- |
| [cashlenx-app](https://github.com/emmett-ola/cashlenx-app) | Cross-platform Flutter client and user experience. |
| [cashlenx-server](https://github.com/emmett-ola/cashlenx-server) | Go REST API, Cobra CLI, authentication, finance services, and MongoDB/MySQL persistence. |
| [cashlenx-design](https://github.com/emmett-ola/cashlenx-design) | Figma-exported React/Vite visual and interaction reference. |
| [cashlenx-website](https://github.com/emmett-ola/cashlenx-website) | Public product and developer-information website. |
| [cashlenx-spec](https://github.com/emmett-ola/cashlenx-spec) | Product and system facts, delivery workflow, decisions, and retained evidence. |

This repository owns the visual and interaction reference. Product behavior is
implemented by the app and server repositories, while durable facts and
delivery workflow are maintained in CashLenX Spec. The design bundle is not a
runtime dependency of the application.

## Running the Code

```bash
npm install
npm run dev
```

## License

This project is licensed under the [MIT License](LICENSE). Commercial use,
modification, and redistribution are permitted when the copyright and license
notices are retained.
