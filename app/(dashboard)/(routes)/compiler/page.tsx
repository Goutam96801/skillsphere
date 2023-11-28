"use client"
import { useState } from 'react';
import Editor from "@monaco-editor/react";
import axios from 'axios';
import OnlineCompiler from './_components/online-compiler';

const CompilerPage = () => {
    const [userCode, setUserCode] = useState(``);
    const [userLang, setUserLang] = useState("python");
    const [userTheme, setUserTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState(20);
    const [userInput, setUserInput] = useState("");
    const [userOutput, setUserOutput] = useState("");
    const [loading, setLoading] = useState(false);

    const options = {
        fontSize: fontSize
    }

    async function compile() {
        setLoading(true);
        if (userCode === ``) {
            return
        }
 
        // Post request to compile endpoint
        await axios.post(`api/compiler`, {
            code: userCode,
            language: userLang,
            input: userInput
        }).then((res) => {
            setUserOutput(res.data.output);
        }).then(() => {
            setLoading(false);
        })
    }
 
    // Function to clear the output screen
    function clearOutput() {
        setUserOutput("");
    }

  return (
    <div>
        <div className="App">
            <OnlineCompiler
                userLang={userLang} setUserLang={setUserLang}
                userTheme={userTheme} setUserTheme={setUserTheme}
                fontSize={fontSize} setFontSize={setFontSize}
            />
            <div className="main">
                <div className="left-container">
                    <Editor
                        options={options}
                        height="50vh"
                        width="80%"
                        theme={userTheme}
                        language={userLang}
                        defaultLanguage="python"
                        defaultValue="# Enter your code here"
                        onChange={(value) => { 
                            setUserCode(value!) }}
                    />
                    <button className="run-btn" onClick={() => compile()}>
                        Run
                    </button>
                </div>
                <div className="right-container">
                    <h4>Input:</h4>
                    <div className="input-box">
                        <textarea id="code-inp" onChange=
                            {(e) => setUserInput(e.target.value)}>
                        </textarea>
                    </div>
                    <h4>Output:</h4>
                    {loading ? (
                        <div className="spinner-box">
                            alt="Loading..."
                        </div>
                    ) : (
                        <div className="output-box">
                            <pre>{userOutput}</pre>
                            <button onClick={() => { clearOutput() }}
                                className="clear-btn">
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default CompilerPage;
