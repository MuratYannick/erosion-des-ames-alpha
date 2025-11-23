# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Erosion des Ames** is a multi-module web application with forum, game, and portal features. The project is in early scaffolding phase - directory structure is established but implementation has not begun.

## Architecture

The project follows a modular architecture with clear backend/frontend separation:

- **backend/** - Backend services (core, forum, game, portal modules)
- **frontend/** - Frontend applications (core, forum, game, portal modules)
- **docs/** - Technical and user documentation

Each feature (forum, game, portal) has its own backend and frontend module, with shared functionality in the `core` modules.

## Current Status

This is a greenfield project. Before implementing features:
1. Determine and document the tech stack (backend language, frontend framework)
2. Initialize package managers and build tools
3. Fill in the architecture documentation in `docs/technical/`
4. Set up build, test, and lint commands

## Documentation

Architecture documentation placeholders exist in:
- `docs/technical/backend/BACK_ARCHITECTURE.md`
- `docs/technical/frontend/FRONT_ARCHITECTURE.md`
- `docs/technical/DOCS_ARCHITECTURE.md`

Progress tracking: `PROGRESS.md`
