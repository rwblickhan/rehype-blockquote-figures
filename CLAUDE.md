# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simple rehype plugin that wraps `<blockquote>` elements in `<figure>` tags and moves the first item from an immediately following list into a `<figcaption>`. The plugin enables semantic blockquote citations as recommended by accessibility guidelines.

## Commands

- **Test**: `pnpm test` - runs unit tests using Node.js test runner
- **Install dependencies**: `pnpm install` (uses pnpm lock file)

## Architecture

The plugin follows the standard rehype plugin pattern:

- **Entry point**: `plugin.js` - exports the default plugin function
- **Core logic**: Uses `unist-util-visit` to traverse the AST and transform blockquote elements
- **Transformation**: 
  - If blockquote is followed by a list: wraps blockquote in figure, moves first list item to figcaption, removes list item from original list
  - If blockquote has no following list: simply wraps in figure element
- **Plugin pattern**: Returns a transformer function that operates on the unified AST

The plugin is designed to work with HTML blockquotes rendered from Markdown via remark/rehype pipeline.