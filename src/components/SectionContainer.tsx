import React from 'react';

interface SectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SectionContainer: React.FC<SectionContainerProps> = ({ children, className = '', ...props }) => (
  <section className={`container mx-auto ${className}`} {...props}>
    {children}
  </section>
);

export default SectionContainer; 