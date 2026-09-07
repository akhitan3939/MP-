import React from 'react';

interface MathFormattedTextProps {
  text: string;
  className?: string;
  inline?: boolean;
}

/**
 * Universal Math and Scientific Text Formatter
 * Formats fractions (\frac{a}{b}), roots (\sqrt{x} or √x), superscripts (^2 or ²),
 * subscripts (_1 or H2O), and Greek/Math symbols with crisp typography.
 */
export const MathFormattedText: React.FC<MathFormattedTextProps> = ({
  text,
  className = '',
  inline = true,
}) => {
  if (!text) return null;

  // Render stacked fraction
  const renderFraction = (num: string, den: string, key: string | number) => (
    <span
      key={key}
      className="inline-flex flex-col items-center justify-center align-middle mx-1 text-[0.9em] leading-none font-serif font-medium"
      style={{ verticalAlign: '-0.35em' }}
    >
      <span className="border-b border-current px-1 pb-0.5 text-center w-full block">
        {formatSubTokens(num)}
      </span>
      <span className="px-1 pt-0.5 text-center w-full block">
        {formatSubTokens(den)}
      </span>
    </span>
  );

  // Render square root
  const renderSqrt = (radicand: string, key: string | number) => (
    <span
      key={key}
      className="inline-flex items-center align-middle mx-0.5 font-serif font-medium"
      style={{ verticalAlign: '-0.1em' }}
    >
      <span className="text-[1.2em] font-normal leading-none select-none">√</span>
      <span className="border-t border-current px-0.5 pt-0.5 -ml-0.5">
        {formatSubTokens(radicand)}
      </span>
    </span>
  );

  // Helper to format sub-tokens (superscripts, subscripts, math symbols)
  const formatSubTokens = (str: string): React.ReactNode[] => {
    // Replace LaTeX-style powers: x^{abc} or x^2
    const tokens: React.ReactNode[] = [];
    // Regex matches:
    // 1. \frac{a}{b}
    // 2. \sqrt{x} or √(x) or √x
    // 3. ^{...} or ^\d+ or ^[a-zA-Z]
    // 4. _{...} or _\d+ or _[a-zA-Z]
    // 5. Unicode powers ² ³ ⁴ ⁿ
    const regex = /(\\frac\{([^{}]+)\}\{([^{}]+)\})|(\\sqrt\{([^{}]+)\}|√\(([^()]+)\)|√([0-9a-zA-Z]+))|(\^\{([^{}]+)\}|\^([0-9a-zA-Z+\-]+))|(_\{([^{}]+)\}|_([0-9a-zA-Z+\-]+))|([²³⁴⁵⁶⁷⁸⁹ⁿ⁺⁻])/g;

    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIdx) {
        tokens.push(str.substring(lastIdx, match.index));
      }

      const matchKey = `token_${match.index}_${tokens.length}`;

      if (match[1]) {
        // \frac{a}{b}
        tokens.push(renderFraction(match[2], match[3], matchKey));
      } else if (match[4]) {
        // Square root
        const rootContent = match[5] || match[6] || match[7] || '';
        tokens.push(renderSqrt(rootContent, matchKey));
      } else if (match[8]) {
        // Superscript
        const supContent = match[9] || match[10];
        tokens.push(
          <sup key={matchKey} className="text-[0.72em] font-bold px-0.5 align-super text-emerald-900 dark:text-emerald-300 font-mono">
            {formatSubTokens(supContent)}
          </sup>
        );
      } else if (match[11]) {
        // Subscript
        const subContent = match[12] || match[13];
        tokens.push(
          <sub key={matchKey} className="text-[0.72em] font-semibold px-0.5 align-sub text-stone-700 dark:text-stone-300 font-mono">
            {formatSubTokens(subContent)}
          </sub>
        );
      } else if (match[14]) {
        // Unicode power
        tokens.push(
          <sup key={matchKey} className="text-[0.8em] font-bold align-super text-emerald-900 dark:text-emerald-300">
            {match[14]}
          </sup>
        );
      }

      lastIdx = regex.lastIndex;
    }

    if (lastIdx < str.length) {
      tokens.push(str.substring(lastIdx));
    }

    return tokens;
  };

  // Split lines if multiline
  const lines = text.split('\n');

  const content = lines.map((line, lineIdx) => {
    // Process math expressions inside delimiters $...$ or general text
    const parts = line.split(/(\$[^$]+\$)/g);

    return (
      <React.Fragment key={`line_${lineIdx}`}>
        {lineIdx > 0 && <br />}
        {parts.map((part, partIdx) => {
          if (part.startsWith('$') && part.endsWith('$') && part.length > 1) {
            const mathContent = part.slice(1, -1);
            return (
              <span
                key={`math_${partIdx}`}
                className="inline-block px-1 py-0.5 rounded bg-amber-50/70 dark:bg-amber-950/40 text-stone-900 dark:text-amber-100 font-serif font-medium border border-amber-200/50 dark:border-amber-800/40 mx-0.5 shadow-2xs"
              >
                {formatSubTokens(mathContent)}
              </span>
            );
          }
          return (
            <span key={`text_${partIdx}`}>
              {formatSubTokens(part)}
            </span>
          );
        })}
      </React.Fragment>
    );
  });

  if (inline) {
    return <span className={`math-content ${className}`}>{content}</span>;
  }

  return <div className={`math-content leading-relaxed ${className}`}>{content}</div>;
};
