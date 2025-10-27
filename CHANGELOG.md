# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2025-10-27

### Security
- Updated dev dependencies to resolve security vulnerabilities
- Fixed 5 vulnerabilities (1 high, 3 moderate, 1 low) in dev dependencies
  - @babel/helpers (<7.26.10)
  - @babel/runtime (<7.26.10)
  - brace-expansion (1.0.0 - 1.1.11)
  - cross-spawn (7.0.0 - 7.0.4)
  - micromatch (<4.0.8)

### Changed
- All tests continue to pass (55/55 tests, 100% coverage)
- Build process verified and working

## [1.0.0] - 2025-10-27

### Changed
- **BREAKING**: Changed license from GPL-3.0-or-later to Apache-2.0 for enterprise compatibility
- Migrated from yarn to npm for package management
- Updated GitHub Actions workflows to use npm instead of yarn
- Upgraded GitHub Actions to v4 (setup-node@v4, checkout@v4)
- Disabled SonarCloud scans on pull requests (only runs on master branch)

### Removed
- Removed yarn.lock file
- Removed all yarn-related references from configuration files

### Fixed
- Fixed GitHub Actions cache errors by switching from yarn to npm cache
- Fixed YAML syntax errors in npm-publish workflow

## [0.5.0.1] - Previous Development Version

### Added
- Type-safe event emitter with TypeScript support
- Priority-based event handling
- Channel-based event handling for isolated event scopes
- `once()` method for single-execution listeners
- `subscribeWithDelay()` for delayed event handling
- `subscribeList()` for bulk event subscriptions
- Comprehensive error handling and resilience
- 100% test coverage (55 tests)
- Zero runtime dependencies

### Features
- Full TypeScript support with strict typing
- Event subscription with priority queues
- Multiple event channels for modular architecture
- Automatic unsubscribe functionality
- Support for async callbacks
- Detailed documentation and examples

[unreleased]: https://github.com/valehasadli/BlinkHub/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/valehasadli/BlinkHub/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/valehasadli/BlinkHub/compare/v0.5.0.1...v1.0.0
[0.5.0.1]: https://github.com/valehasadli/BlinkHub/releases/tag/v0.5.0.1
