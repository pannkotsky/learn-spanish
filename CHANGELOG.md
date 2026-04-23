# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0]

### Added

- Install the site as an app (where your browser supports it), with an **Install app** action in the header when available.
- A simple offline experience: if you lose the network after visiting once, you still see a clear offline page instead of a broken screen.
- Richer install previews on some platforms (store-style screenshots in the install flow).
- Easier discovery and sharing: sitemap for search engines, `robots.txt`, and clearer links when you paste the site on social apps (title, description, and image).

### Changed

- Updated app icons and install metadata so home screen and install dialogs look right on phones and desktops.
- Documented the live site at **learn-spanish.app** in the README and project metadata.

## [0.3.0]

### Added

- GitHub issue templates for bug reports and feature requests.

### Changed

- Improve loading and switching UI theme.
- Improve the UX of loading verbs.

## [0.2.0] - 2026-04-14

### Added

- Footer shows the app version next to the copyright and links to a `/changelog` page.
- Changelog page.

### Changed

- Minor UI improvements for quiz.
- Upgrade 3rd party libraries.

## [0.1.0] - 2026-04-13

### Added

- Initial release: Spanish learning app built with TanStack Start and React, including a paginated verb conjugation matrix, verb quiz flow, GraphQL API with Apollo, Drizzle and PostgreSQL for data, and Better Auth scaffolding.

[unreleased]: https://github.com/pannkotsky/learn-spanish/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/pannkotsky/learn-spanish/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/pannkotsky/learn-spanish/releases/tag/v0.3.0
[0.2.0]: https://github.com/pannkotsky/learn-spanish/releases/tag/v0.2.0
[0.1.0]: https://github.com/pannkotsky/learn-spanish/releases/tag/v0.1.0
