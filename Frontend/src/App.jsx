import { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import Editor from "react-simple-code-editor";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {

  // Some packages may be imported as namespace objects with a `.default` property
  // depending on bundler/interop. Normalize to the actual component/function.
  const ReactMarkdown = (Markdown && typeof Markdown === "object" && "default" in Markdown)
    ? Markdown.default
    : Markdown;

  const CodeEditor = (Editor && typeof Editor === "object" && "default" in Editor)
    ? Editor.default
    : Editor;

  const [code, setCode] = useState(
    "function sum(){ return 1 + 1; }"
  );

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  async function reviewCode() {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/ai/get-review", { code });
      console.log(res.data);
      setReview(res.data.review);
    } catch (err) {
      console.error(err);
      const status = err && err.response && err.response.status;
      const remote = err && err.response && err.response.data;
      setReview(`Error${status ? ` ${status}` : ''}: ${remote && remote.error ? remote.error : err.message}`);
    } finally {
      setLoading(false);
    }
  }


  return (
    <main>
      <div className="left">
        <CodeEditor
          value={code}
          onValueChange={setCode}
          highlight={(code) =>
            Prism.highlight(
              code,
              Prism.languages.javascript,
              "javascript"
            )
          }
          padding={10}
          style={{
            fontFamily: "Fira Code, monospace",
            fontSize: 16,
            border: "1px solid #ddd",
            borderRadius: "5px",
            height: "100%",
            width: "100%"
          }}
        />

        <div className={`review ${loading ? 'disabled' : ''}`} onClick={!loading ? reviewCode : undefined}>
          {loading ? 'Reviewing...' : 'Review'}
        </div>
      </div>

      <div className="right">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{review}</ReactMarkdown>
      </div>
    </main>
  );
}

export default App;





