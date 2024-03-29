import React, { useState, useEffect, useRef } from "react";
import RightBar from "./right-bar";
import LogoSvg from "./svg/logo";
import ThrashSvg from "./svg/trash";
import Footer from "./footer";

const NoteApp = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [notes, setNotes] = useState([]);
  const [selectedDataId, setSelectedDataId] = useState(null);
  const [textAlignment, setTextAlignment] = useState("left");
  const [textColor, setTextColor] = useState("#dcdcdd");
  const [fontSize, setFontSize] = useState("Medium");
  const [isTextBold, setIsTextBold] = useState(false);
  const [isTextItalic, setIsTextItalic] = useState(false);
  const [isTextUnderline, setIsTextUnderline] = useState(false);
  const [nextDataId, setNextDataId] = useState(1);

  const noteInputRef = useRef(null);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(storedNotes);
  }, []); 
  
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleNewNoteClick = () => {
    const newNoteContent = noteInputRef.current.value.trim();

    if (newNoteContent !== "") {
      const truncatedContent = truncateAndAddEllipsis(newNoteContent);

      const newNote = {
        id: Date.now(),
        content: truncatedContent,
        dataId: nextDataId,
      };

      setNotes([newNote, ...notes]);
      setSelectedDataId(newNote.dataId);
      localStorage.setItem("notes", JSON.stringify([newNote, ...notes]));

      noteInputRef.current.setAttribute("data-id", newNote.dataId);

      setNextDataId(nextDataId + 1);

      noteInputRef.current.value = "";
    }
  };

  const truncateAndAddEllipsis = (content, maxLength = 25) => {
    if (content.length <= maxLength) {
      return content;
    } else {
      return content.slice(0, maxLength - 3) + "...";
    }
  };

  const handleDivClick = (dataId, event) => {
    if (event && event.target && event.target.classList.contains("trash-btn")) {
      handleDeleteNote(dataId);
    } else {
      setSelectedDataId(dataId);
      setNoteContent(dataId);
    }
  };

  const handleDeleteNote = (dataId) => {
    const updatedNotes = notes.filter((note) => note.dataId !== dataId);
    setNotes(updatedNotes);
  
if (selectedDataId === dataId || updatedNotes.length === 1) {
  const newSelectedDataId = updatedNotes.length > 0 ? updatedNotes[0].dataId : null;
  setSelectedDataId(newSelectedDataId);

  setNoteContent(newSelectedDataId);

  console.log("Deleted DataId:", dataId);
  console.log("Selected DataId After Deletion:", newSelectedDataId);

  noteInputRef.current.value = ""; 
}


  };
  

  const setNoteContent = (dataId) => {
    const selectedNote = notes.find((note) => note.dataId === dataId);
    if (selectedNote) {
      noteInputRef.current.value = selectedNote.content;
    } else {
      // Eğer not bulunamazsa, içeriği sıfırla
      noteInputRef.current.value = "";
    }
  };

  const formattedDateTime = () => {
    const day = currentDateTime.getDate();
    const month = formatMonth(currentDateTime.getMonth());
    const year = currentDateTime.getFullYear();
    const hours = currentDateTime.getHours().toString().padStart(2, "0");
    const minutes = currentDateTime.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const formatMonth = (month) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    return monthNames[month];
  };

  const handleTextAlignmentChange = (alignment) => {
    setTextAlignment(alignment);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
  };

  const handleChecklistChange = (checklistContent) => {
    if (selectedDataId !== null) {
      const updatedNotes = [...notes];
      const selectedNoteIndex = updatedNotes.findIndex((note) => note.dataId === selectedDataId);

      if (selectedNoteIndex !== -1) {
        updatedNotes[selectedNoteIndex].content = checklistContent;
        setNotes(updatedNotes);
      }
    }

    setNoteContent(selectedDataId);
  };

  const handleDownloadPDF = () => {
    const noteContent = noteInputRef.current.value;
    copyToClipboard(noteContent);
    downloadPDF(noteContent, 'note.pdf');
  };

  const handleTextBoldToggle = () => {
    setIsTextBold(!isTextBold);
  };

  const handleTextItalicToggle = () => {
    setIsTextItalic(!isTextItalic);
  };

  const handleTextUnderlineToggle = () => {
    setIsTextUnderline(!isTextUnderline);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard');
    } catch (err) {
      console.error('Unable to copy text to clipboard', err);
    }
  };

  const downloadPDF = (content, fileName) => {
    const htmlContent = `<html><body><pre>${content}</pre></body></html>`;
    const blob = new Blob([htmlContent], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="note-app-container">
      <div className="left-content">
        <div className="veqsy_logo">
          <LogoSvg />
        </div>
        <button className="new-note-btn" onClick={handleNewNoteClick}>
          New Note
        </button>
        {notes.length > 0 && (
          <ul className="notes-container">
           {notes.map((prevNote) => (
  <li
    key={prevNote.id}
    className={`previous-note ${prevNote.dataId === selectedDataId ? "selected" : ""}`}
    data-id={prevNote.dataId} // Set data-id for the previous-note div
    onClick={() => handleDivClick(prevNote.dataId)}
  >
    {prevNote.content}
    <button
      className="trash-btn"
      onClick={() => handleDeleteNote(prevNote.dataId)}
    >
      <ThrashSvg />
    </button>
  </li>
))}

          </ul>
        )}
      </div>

      <div className="home-container">
        <div className="current-date-time-container">
          <span>{formattedDateTime()}</span>
        </div>
        <RightBar
          textAlignment={textAlignment}
          onTextAlignmentChange={handleTextAlignmentChange}
          onColorChange={setTextColor}
          onFontSizeChange={handleFontSizeChange}
          onChecklistChange={handleChecklistChange}
          onDownloadPDF={handleDownloadPDF}
          onTextBoldToggle={handleTextBoldToggle}
          onTextItalicToggle={handleTextItalicToggle}
          onTextUnderlineToggle={handleTextUnderlineToggle}
        />
        <div className="note-input-container">
          <textarea 
            ref={noteInputRef}
            data-id={selectedDataId} // Set data-id for the textarea
            style={{
              resize: "none",
              textAlign: textAlignment,
              color: textColor,
              fontSize: fontSize,
              fontWeight: isTextBold ? "bold" : "normal",
              fontStyle: isTextItalic ? "italic" : "normal",
              textDecoration: isTextUnderline ? "underline" : "none",
            }}
            className="note-input"
            type="text"
            placeholder="Enter note..."
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NoteApp;
