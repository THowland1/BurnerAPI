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

const JSONEditor: FC<IAceEditorProps> = (props) => {
  return (
    <AceEditor
      mode='json5'
      theme='monokai'
      name='UNIQUE_ID_OF_DIV'
      editorProps={{ $blockScrolling: true }}
      setOptions={{ useWorker: false }}
      {...props}
    />
  );
};

export default JSONEditor;
