import Editor from "@monaco-editor/react";
import "monaco-editor/esm/vs/basic-languages/python/python.contribution";
import PropTypes from "prop-types";

const EditorComp = ({ code, handleCodeChange }) => {
  return (
    <>
      <Editor
        height="100vh"
        theme="vs-dark"
        language="javascript"
        value={code}
        onChange={handleCodeChange}
        options={{
          fontSize: "22px",
          letterSpacing: 1.5,
        }}
      />
    </>
  );
};

EditorComp.propTypes = {
  code: PropTypes.string.isRequired,
  handleCodeChange: PropTypes.func.isRequired,
};

export default EditorComp;
