declare module "*.mdx" {
  import { ComponentType } from "react";
  export const attributes: Record<string, unknown>;
  const MDXComponent: ComponentType;
  export default MDXComponent;
}

declare module "*?raw" {
  const content: string;
  export default content;
}
