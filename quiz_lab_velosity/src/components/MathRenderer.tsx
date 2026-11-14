import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  asBlock?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '', asBlock = false }) => {
  const html = useMemo(() => {
    if (!content) return '';

    // Split text by $$...$$ for block math, then $...$ for inline math
    // Also support bold text **word**
    let formatted = content;

    // Replace block math $$...$$
    formatted = formatted.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
      try {
        return `<div class="my-2 py-1 text-center">${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`;
      } catch {
        return `<div class="my-2 font-mono text-center">${math}</div>`;
      }
    });

    // Replace inline math $...$
    formatted = formatted.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      try {
        return `<span class="inline-block px-1 align-baseline">${katex.renderToString(math.trim(), { displayMode: false, throwOnError: false })}</span>`;
      } catch {
        return `<span class="font-mono">${math}</span>`;
      }
    });

    // Replace **bold**
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-sky-700 dark:text-sky-300">$1</strong>');

    return formatted;
  }, [content]);

  if (asBlock) {
    return (
      <div
        className={`leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
