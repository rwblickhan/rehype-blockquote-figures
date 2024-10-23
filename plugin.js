import { visit } from "unist-util-visit";

/**
 * Rehype plugin that wraps blockquotes in figure elements and moves
 * the last paragraph to a figcaption
 * @returns {import('unified').Transformer}
 */
export default function rehypeBlockquoteFigures() {
  return function transformer(tree) {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "blockquote") return;

      const paragraphs = node.children.filter(
        (child) => child.type === "element" && child.tagName === "p",
      );

      if (paragraphs.length > 1) {
        const lastParagraph = paragraphs[paragraphs.length - 1];
        node.children = node.children.filter(
          (child) => child !== lastParagraph,
        );

        const figure = {
          type: "element",
          tagName: "figure",
          properties: {},
          children: [
            node,
            {
              type: "element",
              tagName: "figcaption",
              properties: {},
              children: lastParagraph.children,
            },
          ],
        };
        parent.children[index] = figure;
      } else {
        const figure = {
          type: "element",
          tagName: "figure",
          properties: {},
          children: [node],
        };
        parent.children[index] = figure;
      }
    });
  };
}
