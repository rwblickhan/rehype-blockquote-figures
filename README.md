# rehype-blockquote-figures

## What is this?

A simple rehype plugin that wraps `<blockquote>` tags in `<figure>` and moves
the immediately-following list item into a `<figcaption>`.

## When should I use this?

This lets you use a `<figcaption>` as the citation for a `<blockquote>`, as
[recommended by Heydon
Pickering](https://heydonworks.com/article/the-blockquote-element/).

This plugin is optimal for HTML `<blockquote>`s rendered from Markdown (e.g. by remark).

## Example

### Input Markdown

```markdown
> Space is big. You just won't believe how vastly, hugely, mind-bogglingly big it is. I mean, you may think it's a long way down the road to the chemist's, but that's just peanuts to space.

- Douglas Adams, *The Hitchhiker's Guide to the Galaxy*
```

### Output HTML

```html
<figure>
  <blockquote>
    <p>Space is big. You just won't believe how vastly, hugely, mind-bogglingly big it is. I mean, you may think it's a long way down the road to the chemist's, but that's just peanuts to space.</p>
  </blockquote>
  <figcaption>Douglas Adams, </em>The Hitchhiker's Guide to the Galaxy</em></figcaption>
</figure>
```

## Usage

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeBlockquoteFigures from 'rehype-blockquote-figures';

const result = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeBlockquoteFigures)
  .use(rehypeStringify)
  .process(markdown);
```