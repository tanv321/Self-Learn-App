import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [inputAnswer, setInputAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [numbLine, setLine] = useState(0)
  const [recognition, setRecognition] = useState(null);
  const [questionStyle, setQuestionStyle] = useState({ fontSize: "80px" });
  const [ButtonClicked, setButtonClicked] = useState(false);



  useEffect(() => {
    // Set the font size of the question based on the device width
    const width = window.innerWidth;
    if (width < 800) {
      setQuestionStyle({ fontSize: "30px" });
    } else {
      setQuestionStyle({ fontSize: "60px" });
    }
  }, []);


  function revealAnswer(){
    setButtonClicked(true);
  }

  function initRecognition() {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const result = event.results[event.resultIndex];
      if (result.isFinal) {
        setInputAnswer(result[0].transcript);
        handleSubmit(event);
        recognition.stop();
      }
    };
    setRecognition(recognition);
  }

  function handleStartRecognition() {
    if (!recognition) {
      initRecognition();
    }
    recognition.start();
  }
  

  function handleSubmit(e) {
    e.preventDefault();

    if (inputAnswer.trim().toLowerCase() === answer.trim().toLowerCase()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  }

  function handleNewQuestion() {
    setButtonClicked(false);
    if (file) {


    const reader = new FileReader();
    let text = "";
    const promise = new Promise(resolve => {
      reader.onload = function(event) {
        text = event.target.result;
        resolve();
      };
    });
    reader.readAsText(file);

promise.then(() => {
    const pairs = text.split("Question:").filter(Boolean).map(str => {
    const [question, answer] = str.trim().split("Answer:");
    return [question.trim(), answer.trim()];
    
  });
    const map = new Map(pairs);
    // console.log("oom", map.get("tumi kamon acho?"), "moo", text)

    const arr = Array.from(map); // Convert map to array
    setLine(arr.length)
    const randomIndex = Math.floor(Math.random() * (numbLine + 1));

    const randomPair = arr[randomIndex]; // Get random pair
    const randomValue = randomPair[0]; // Get random value

    setQuestion(randomPair[0])
    setAnswer(randomPair[1])
    setInputAnswer("");
    setIsCorrect(null);

    

      
  });
    
}

    
}
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <button style={{ fontSize: "35px", color: "purple" }} onClick={handleStartRecognition}>  🎤🎤 Microphone 🎤🎤 </button>

      <textarea 
        className="small-textarea" 
  value={inputAnswer} 
  onChange={e => setInputAnswer(e.target.value)}
  rows={10}
  cols={50}
/>

        
        <button style={{ fontSize: "40px", color: "red" }} type="submit">Submit</button>
      </form>
      {question && (
        <div>
           <button onClick={revealAnswer}> idk?</button>
           <p>{ButtonClicked && answer}</p>

          <p style={questionStyle}> Question: {question}</p>
          {isCorrect !== null && (
            <p style={{ questionStyle, color: "green" }}>{ isCorrect ? "Correct!" : "Incorrect :("}.</p>
          )}

         
        </div>
      )}
      
      <button style={{ fontSize: "40px", color: "blue" }}  onClick={handleNewQuestion}>New Question</button>
      <form>
        <label>
          Upload Text File:
          <input type="file" onChange={e => setFile(e.target.files[0])} />
        </label>
      </form>
    </div>
  );
}

export default App;
