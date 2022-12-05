import "./App.css";
import { Routes, Route } from "react-router-dom";
import Chatspage from "./Screens/Chatspage";
import Homepage from "./Screens/Homepage";

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' end element={<Homepage />} />
        <Route path='/chats' element={<Chatspage />} />
      </Routes>
    </div>
  );
}

export default App;

// Chakra Layout
// chakra Component
// chakra Hooks
// App Components
// React Accs
