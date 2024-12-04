import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useActionData } from "react-router-dom";
import Chat from './pages/Chat';
import HorizontalChat from './pages/HorizontalChat';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path='/' element={<Chat />} />
          <Route path='/horizontal' element={<HorizontalChat />} />
      </Routes>
    </div>
  );
}

export default App;
