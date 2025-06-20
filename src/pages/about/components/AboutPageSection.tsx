
import React from "react";
import { cn } from "@/lib/utils";

interface AboutPageSectionProps {
  id: string;
  className?: string;
  ariaLabelledBy?: string;
  children: React.ReactNode;
}

const AboutPageSection: React.FC<AboutPageSectionProps> = ({
  id,
  className,
  ariaLabelledBy,
  children
}) => {
  return (
    <section
      id={id}
      className={cn("container-max", className)}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </section>
  );
};

export default AboutPageSection;