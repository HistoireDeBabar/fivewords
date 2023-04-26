import { SetStateAction, useState } from 'react'

function App() {
  const initialPlaceholder = "The Lord of the Rings..."
  const [spoiled, setSpoiled] = useState(false);
  const [message, setMessage] = useState("  ");
  const [revealMessage, setRevealMessage] = useState(false);
  const [placeholder, setPlaceholder] = useState(initialPlaceholder);
  const [titleAnimation, setTitleAnimation] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [item, setItem] = useState("");

  function generate() {
    setLoadingState(true);
    setRevealMessage(false);

    const body = !spoiled ? initialPlaceholder.split(".")[0] : item
    fetch(import.meta.env.VITE_APP_API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then((response) => response.text())
      .then((textResponse) => {
        setTitleAnimation("shrink")
        setLoadingState(false);
        setMessage(textResponse);
        setTimeout(() => {
          setRevealMessage(true);
        }, 500)
      })
  }

  function focusInput() {
    setPlaceholder("")
    setMessage("")
    setItem("")
    setTitleAnimation("swell")
  }

  function blurInput() {
    if (placeholder == "") {
      setPlaceholder(initialPlaceholder)
    }
  }

  function generateForReturn(e: { key: string; }) {
    if (e.key === 'Enter') {
      generate();
    }
  }

  function changeInput(e: { target: { value: SetStateAction<string>; }; }) {
    setItem(e.target.value)
    if (!spoiled) {
      setSpoiled(true)
    }
  }

  return (
    <div className="App">
      <h1 className={`"App-Title ${titleAnimation}`}>In <u>five</u> words<br />or less</h1>
      <div className="card">
        <div className="App-Result">
          { revealMessage ?  <p>{message}</p> : null }
          { loadingState ?  <div className="loader"></div> : null }
        </div>
        <div className="App-Input">
          <input onFocus={focusInput} onBlur={blurInput} type='text' onKeyDown={generateForReturn} placeholder={placeholder} value={item} onChange={changeInput} /><br />
        </div>
        <button disabled={loadingState} onClick={generate}>Generate</button>
      </div>
    </div>
  );
}

export default App
