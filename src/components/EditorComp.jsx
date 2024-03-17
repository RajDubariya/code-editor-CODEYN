import Editor from "@monaco-editor/react";
import PropTypes from "prop-types";

const EditorComp = ({ code, handleCodeChange }) => {
  return (
    <>
      <Editor
        height="100vh"
        theme="vs-dark"
        defaultLanguage="javascript"
        value={code}
        onChange={handleCodeChange}
      />
    </>
  );
};

EditorComp.propTypes = {
  code: PropTypes.string.isRequired,
  handleCodeChange: PropTypes.func.isRequired,
};

export default EditorComp;
