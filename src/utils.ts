export function getDataStudioElement(container: string) {
  let root = document.getElementById(container);
  if (!root) {
    root = document.createElement("div");
    root.id = container;
    document.body.prepend(root);
  }
  return root;
}
