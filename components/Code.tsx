import React, { FC, useEffect } from 'react';

import Prism from 'prismjs';
import { styled } from '@mui/system';

const Code: FC<{ language: 'json5' | 'bash' }> = ({ children, language }) => {
  useEffect(() => {
    require('prismjs/components/prism-json.min');
    require('prismjs/components/prism-json5.min');
    require('prismjs/components/prism-bash.min');
    Prism.highlightAll();
  }, []);
  useEffect(() => {
    Prism.highlightAll();
  }, [children]);
  return (
    <Editor>
      <pre
        className={`language-${language}`}
        style={{ maxHeight: '20rem', overflow: 'auto' }}
      >
        <code>{children}</code>
      </pre>
    </Editor>
  );
};

export default Code;

const Editor = styled('div')`
  code[class*='language-'],
  pre[class*='language-'] {
    font-family: monospace;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    background: ${(props) => props.theme.palette.grey[900]};
    color: ${(props) => props.theme.palette.primary.dark};
  }

  pre > code[class*='language-'] {
    font-size: 1em;
  }

  pre[class*='language-']::-moz-selection,
  pre[class*='language-'] ::-moz-selection,
  code[class*='language-']::-moz-selection,
  code[class*='language-'] ::-moz-selection {
    text-shadow: none;
    background: ${(props) => props.theme.palette.grey[700]};
  }

  pre[class*='language-']::selection,
  pre[class*='language-'] ::selection,
  code[class*='language-']::selection,
  code[class*='language-'] ::selection {
    text-shadow: none;
    background: ${(props) => props.theme.palette.grey[700]};
  }

  /* Code blocks */
  pre[class*='language-'] {
    /* padding: 1em; */
    margin: 0;
    overflow: auto;
  }

  /* Inline code */
  :not(pre) > code[class*='language-'] {
    /* padding: 0.1em; */
    border-radius: 0.3em;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: ${(props) => props.theme.palette.grey[600]};
  }

  .token.punctuation {
    color: ${(props) => props.theme.palette.primary[50]};
  }

  .token.namespace {
    opacity: 0.7;
  }

  .token.tag,
  .token.operator,
  .token.number {
    color: ${(props) => props.theme.palette.primary[50]};
  }

  .token.property,
  .token.function {
    color: ${(props) => props.theme.palette.primary.light};
    font-weight: 500;
  }

  .token.tag-id,
  .token.selector,
  .token.atrule-id {
    color: #f0fff0;
  }

  code.language-javascript,
  .token.attr-name {
    color: #b3d6b3;
  }

  code.language-css,
  code.language-scss,
  .token.boolean,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .language-scss .token.string,
  .style .token.string,
  .token.attr-value,
  .token.keyword,
  .token.control,
  .token.directive,
  .token.unit,
  .token.statement,
  .token.regex,
  .token.atrule {
    color: ${(props) => props.theme.palette.primary[50]};
  }

  .token.string {
    color: ${(props) => props.theme.palette.grey[50]};
  }

  .token.placeholder,
  .token.variable {
    color: #e5fb79;
  }

  .token.deleted {
    text-decoration: line-through;
  }

  .token.inserted {
    border-bottom: 1px dotted #f0fff0;
    text-decoration: none;
  }

  .token.italic {
    font-style: italic;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }

  .token.important {
    color: #b3d6b3;
  }

  .token.entity {
    cursor: help;
  }

  pre > code.highlight {
    outline: 0.4em solid #5c705c;
    outline-offset: 0.4em;
  }

  /* overrides color-values for the Line Numbers plugin
 * http://prismjs.com/plugins/line-numbers/
 */
  .line-numbers.line-numbers .line-numbers-rows {
    border-right-color: #2c302c;
  }

  .line-numbers .line-numbers-rows > span:before {
    color: #3b423b;
  }

  /* overrides color-values for the Line Highlight plugin
* http://prismjs.com/plugins/line-highlight/
*/
  .line-highlight.line-highlight {
    background: rgba(162, 179, 77, 0.2);
    background: -webkit-linear-gradient(
      left,
      rgba(162, 179, 77, 0.2) 70%,
      rgba(162, 179, 77, 0)
    );
    background: linear-gradient(
      to right,
      rgba(162, 179, 77, 0.2) 70%,
      rgba(162, 179, 77, 0)
    );
  }
`;
