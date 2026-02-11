'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function transformMath(html: string) {
  return html.replace(
    /⟦([\s\S]*?)⟧/g,
    (_, latex) => `<span data-math data-rendered="false">${latex}</span>`,
  );
}

export default function MathHtmlRenderer({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const nodes = ref.current.querySelectorAll(
      '[data-math][data-rendered="false"]',
    );

    nodes.forEach((node) => {
      const latex = node.textContent?.trim();
      if (!latex) return;

      katex.render(latex, node as HTMLElement, {
        throwOnError: false,
        displayMode: false,
      });

      node.setAttribute('data-rendered', 'true');
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className='prose max-w-none'
      dangerouslySetInnerHTML={{ __html: transformMath(html) }}
    />
  );
}
