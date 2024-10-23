# rehype-blockquote-figures

## What is this?

A simple rehype plugin that wraps `<blockquote>` tags in `<figure>` and moves
the final paragraph into a `<figcaption>`.

## When should I use this?

This lets you use a `<figcaption>` as the citation for a `<blockquote>`, as
[recommended by Heydon
Pickering](https://heydonworks.com/article/the-blockquote-element/).

This plugin is optimal for HTML `<blockquote>`s rendered from Markdown (e.g. by remark).
