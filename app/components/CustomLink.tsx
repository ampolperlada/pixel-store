import { ReactNode } from "react";

interface CustomLinkProps {
  href: string;
  children: ReactNode;
}

const CustomLink = ({ href, children }: CustomLinkProps) => (
  <a href={href} className="underline">
    {children}
  </a>
);

export default CustomLink;
