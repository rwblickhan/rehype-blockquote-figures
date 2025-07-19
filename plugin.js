import { visit } from "unist-util-visit";

/**
 * Rehype plugin that wraps blockquotes in figure elements and moves
 * the immediately following list item to a figcaption
 * @returns {import('unified').Transformer}
 */
export default function rehypeBlockquoteFigures() {
  return function transformer(tree) {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "blockquote") return;

      // Find the next non-text sibling that's a list
      let nextListSibling = null;
      let nextListIndex = -1;
      
      for (let i = index + 1; i < parent.children.length; i++) {
        const sibling = parent.children[i];
        if (sibling.type === "element" && 
            (sibling.tagName === "ul" || sibling.tagName === "ol")) {
          nextListSibling = sibling;
          nextListIndex = i;
          break;
        } else if (sibling.type === "element") {
          // Stop if we hit another non-list element
          break;
        }
        // Continue if it's just text (like whitespace)
      }
      
      const isFollowedByList = nextListSibling !== null;

      if (isFollowedByList && nextListSibling.children.length > 0) {
        // Get the first list item (skip text nodes)
        const firstListItem = nextListSibling.children.find(child => 
          child.type === "element" && child.tagName === "li"
        );
        
        if (firstListItem) {
          // Remove the first list item from the list
          nextListSibling.children = nextListSibling.children.filter(child => child !== firstListItem);
          
          // If the list has no more list items, remove it entirely
          const hasListItems = nextListSibling.children.some(child => 
            child.type === "element" && child.tagName === "li"
          );
          if (!hasListItems) {
            parent.children.splice(nextListIndex, 1);
          }
          
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
                children: firstListItem.children,
              },
            ],
          };
          parent.children[index] = figure;
        }
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
