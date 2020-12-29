export function getMetaTagsContentByName(element: Element, name: string) {
  const head = element.querySelector('head') as HTMLHeadElement;
  const metaTags = head.querySelectorAll(
    `meta[name="${name}"]`
  ) as NodeListOf<HTMLMetaElement>;
  const content: string[] = [];
  metaTags.forEach((tag) => content.push(tag.content));
  return content;
}
