import React, { useState } from 'react';
import NoteApp from './components/note-app';
function App() {
  const [note, setNote] = useState('');

  const handleNoteChange = (newNote) => {
    setNote(newNote);
  };

  return (
    <div className="App">
      <NoteApp onNoteChange={handleNoteChange} />
    </div>
  );
}

export default App;
