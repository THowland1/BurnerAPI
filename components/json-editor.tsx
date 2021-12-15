import { darken, styled } from '@mui/system';
import dynamic from 'next/dynamic';
import React, { FC } from 'react';
import { IAceEditorProps } from 'react-ace';

const AceEditor = dynamic(
  async () => {
    const acer = await import('react-ace');
    require('ace-builds');
    require('ace-builds/src-noconflict/mode-json5');
    require('ace-builds/src-noconflict/theme-monokai');
    return acer;
  },
  {
    // eslint-disable-next-line react/display-name
    loading: () => {
      return <span>...</span>;
    },
    ssr: false,
  }
);

const JSONEditor: FC<IAceEditorProps & { fontSize?: string }> = ({
  fontSize = '1rem',
  ...props
}) => {
  return (
    <Editor>
      <AceEditor
        mode='json5'
        theme='monokai'
        name='UNIQUE_ID_OF_DIV'
        setOptions={{
          useWorker: false,
          fontFamily: 'monospace',
          tabSize: 2,
          fontSize,
          minLines: props.minLines ?? 10,
          maxLines: props.maxLines ?? 20,
          highlightGutterLine: props.highlightActiveLine ?? true,
        }}
        wrapEnabled
        width='100%'
        {...props}
      />
    </Editor>
  );
};

export default JSONEditor;

const Editor = styled('div')`
  background-color: ${(props) => props.theme.palette.grey[900]};
  color: #f8f8f2;
  border-radius: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;

  .ace_scroller {
    background: ${(props) => darken(props.theme.palette.grey[900], 0)};
    color: ${(props) => props.theme.palette.grey[50]};
  }
  .ace_gutter {
    background: ${(props) => props.theme.palette.grey[900]};
    color: #8f908a;
  }
  .ace_print-margin {
    width: 1px;
    background: ${(props) => props.theme.palette.grey[900]};
  }

  .ace_cursor {
    color: ${(props) => props.theme.palette.grey[50]};
  }
  .ace_marker-layer .ace_selection {
    background: ${(props) => props.theme.palette.grey[700]};
  }
  .ace-monokai.ace_multiselect .ace_selection.ace_start {
    box-shadow: 0 0 3px 0px #272822;
  }
  .ace_marker-layer .ace_step {
    background: blue;
  }
  .ace_marker-layer .ace_bracket {
    margin: -1px 0 0 -1px;
    border: 1px solid #49483e;
  }
  .ace_marker-layer .ace_active-line {
    background: ${(props) => darken(props.theme.palette.grey[900], 0.3)};
  }
  .ace_gutter-active-line {
    background: ${(props) => darken(props.theme.palette.grey[900], 0.3)};
  }
  .ace_marker-layer .ace_selected-word {
    border: 1px solid #49483e;
  }
  .ace_invisible {
    color: #52524d;
  }
  .ace_entity.ace_name.ace_tag,
  .ace_keyword,
  .ace_meta.ace_tag,
  .ace_storage {
    color: #f92672;
  }
  .ace_punctuation,
  .ace_punctuation.ace_tag {
    color: ${(props) => props.theme.palette.grey[50]};
  }
  .ace_constant.ace_character,
  .ace_constant.ace_language,
  .ace_constant.ace_numeric,
  .ace_constant.ace_other {
    color: ${(props) => props.theme.palette.primary[50]};
  }
  .ace_invalid {
    color: #f8f8f0;
    background-color: #f92672;
  }
  .ace_invalid.ace_deprecated {
    color: #f8f8f0;
    background-color: #ae81ff;
  }
  .ace_support.ace_constant,
  .ace_support.ace_function {
    color: #66d9ef;
  }
  .ace_fold {
    background-color: ${(props) => props.theme.palette.primary.dark};
    border-color: ${(props) => props.theme.palette.grey[900]};
  }
  .ace_storage.ace_type,
  .ace_support.ace_class,
  .ace_support.ace_type {
    font-style: italic;
    color: #66d9ef;
  }
  .ace_entity.ace_name.ace_function,
  .ace_entity.ace_other,
  .ace_entity.ace_other.ace_attribute-name,
  .ace_variable {
    color: ${(props) => props.theme.palette.primary.light};
  }
  .ace_variable.ace_parameter {
    font-style: italic;
    color: #fd971f;
  }
  .ace_string {
    color: ${(props) => props.theme.palette.grey[50]};
  }
  .ace_comment {
    color: ${(props) => props.theme.palette.grey[600]};
  }
  .ace_indent-guide {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC)
      right repeat-y;
  }
`;
