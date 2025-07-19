import { test } from 'node:test';
import assert from 'node:assert';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeBlockquoteFigures from '../plugin.js';

async function processMarkdown(markdown) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeBlockquoteFigures)
    .use(rehypeStringify)
    .process(markdown);
  
  return result.toString();
}

test('wraps blockquote with following list item in figure with figcaption', async () => {
  const markdown = `> This is a quote

- Citation author`;

  const result = await processMarkdown(markdown);
  
  assert.ok(result.includes('<figure>'));
  assert.ok(result.includes('<blockquote>'));
  assert.ok(result.includes('<figcaption>Citation author</figcaption>'));
  assert.ok(result.includes('</figure>'));
  assert.ok(!result.includes('<ul>') || !result.includes('<li>Citation author</li>'));
});

test('wraps blockquote with following ordered list item in figure with figcaption', async () => {
  const markdown = `> This is a quote

1. Citation source`;

  const result = await processMarkdown(markdown);
  
  assert.ok(result.includes('<figure>'));
  assert.ok(result.includes('<blockquote>'));
  assert.ok(result.includes('<figcaption>Citation source</figcaption>'));
  assert.ok(result.includes('</figure>'));
});

test('removes list entirely if only one item used for citation', async () => {
  const markdown = `> Quote here

- Only citation`;

  const result = await processMarkdown(markdown);
  
  assert.ok(result.includes('<figcaption>Only citation</figcaption>'));
  assert.ok(!result.includes('<ul>'));
  assert.ok(!result.includes('<li>'));
});

test('keeps remaining list items after using first for citation', async () => {
  const markdown = `> Quote here

- Citation
- Other item
- Another item`;

  const result = await processMarkdown(markdown);
  
  assert.ok(result.includes('<figcaption>Citation</figcaption>'));
  assert.ok(result.includes('<ul>'));
  assert.ok(result.includes('<li>Other item</li>'));
  assert.ok(result.includes('<li>Another item</li>'));
  assert.ok(!result.includes('<li>Citation</li>'));
});

test('wraps blockquote in figure without figcaption when no following list', async () => {
  const markdown = `> Quote without citation

Some other text`;

  const result = await processMarkdown(markdown);
  
  assert.ok(result.includes('<figure>'));
  assert.ok(result.includes('<blockquote>'));
  assert.ok(!result.includes('<figcaption>'));
  assert.ok(result.includes('</figure>'));
});

test('handles blockquote with no following content', async () => {
  const markdown = `> Standalone quote`;

  const result = await processMarkdown(markdown);
  
  assert.ok(result.includes('<figure>'));
  assert.ok(result.includes('<blockquote>'));
  assert.ok(!result.includes('<figcaption>'));
  assert.ok(result.includes('</figure>'));
});

test('ignores blockquote when followed by non-list element', async () => {
  const markdown = `> Quote here

This is a paragraph, not a list.`;

  const result = await processMarkdown(markdown);
  
  assert.ok(result.includes('<figure>'));
  assert.ok(result.includes('<blockquote>'));
  assert.ok(!result.includes('<figcaption>'));
  assert.ok(result.includes('</figure>'));
  assert.ok(result.includes('<p>This is a paragraph, not a list.</p>'));
});

test('handles empty list following blockquote', async () => {
  const markdown = `> Quote here

- `;

  const result = await processMarkdown(markdown);
  
  // Should handle gracefully - either wrap without citation or skip empty items
  assert.ok(result.includes('<figure>'));
  assert.ok(result.includes('<blockquote>'));
});