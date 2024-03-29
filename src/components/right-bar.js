import React, { useState, useEffect, useRef } from 'react';
import CenterText from './svg/center-text';
import LeftText from './svg/left-text';
import RightText from './svg/right-text';
import Pdf from './svg/pdf';

function RightBar({
  onTextAlignmentChange,
  onColorChange,
  onFontSizeChange,
  onDownloadPDF,
  onTextBoldToggle,
  onTextItalicToggle, 
  onTextUnderlineToggle, 
}) {
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(true);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const fontDropdownRef = useRef(null);

  const toggleFontDropdown = () => {
    setIsFontDropdownOpen(!isFontDropdownOpen);
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    onColorChange(newColor);
  };

  const handleFontSizeSelect = (size) => {
    toggleFontDropdown();
    onFontSizeChange(size);
  };

  const toggleBoldText = () => {
    onTextBoldToggle();
  };

  const toggleItalicText = () => {
    onTextItalicToggle();
  };

  const toggleUnderlineText = () => {
    onTextUnderlineToggle();
  };

  const fontOptions = ['Small', 'Medium', 'Large'];

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(e.target)) {
        setIsFontDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const colorPickerTimeout = setTimeout(() => {
      setIsColorPickerOpen(true);
    }, 0);

    return () => clearTimeout(colorPickerTimeout);
  }, []);

  return (
    <div className="control-panel">
      <div
        className={`font-size control-panel-item ${isFontDropdownOpen ? 'open' : ''}`}
        onClick={toggleFontDropdown}
        ref={fontDropdownRef}
      >
        Aa
        {isFontDropdownOpen && (
          <div className="font-dropdown">
            {fontOptions.map((option, index) => (
              <div key={index} className="font-option" onClick={() => handleFontSizeSelect(option)}>
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className={`bold-text control-panel-item`}
        onClick={toggleBoldText}
      >
        A
      </div>

      <div
        className={`italic-text control-panel-item`}
        onClick={toggleItalicText}
      >
        <i>A</i>
      </div>

      <div
        className={`underline-text control-panel-item`}
        onClick={toggleUnderlineText} 
      >
        <u>A</u>
      </div>

      <div className='left-text control-panel-item' onClick={() => onTextAlignmentChange('left')}>
        <LeftText />
      </div>

      <div className='center-text control-panel-item' onClick={() => onTextAlignmentChange('center')}>
        <CenterText />
      </div>

      <div className='right-text control-panel-item' onClick={() => onTextAlignmentChange('right')}>
        <RightText />
      </div>

      <div className={`share control-panel-item ${isColorPickerOpen ? 'open' : ''}`}>
        <div className="color-picker">
          <div className="color-picker-label" onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}>
          </div>
          {isColorPickerOpen && (
            <input type="color" value={selectedColor} onChange={handleColorChange} />
          )}
        </div>
      </div>

      <div className='pdf control-panel-item' onClick={onDownloadPDF}>
        <Pdf />
      </div>
    </div>
  );
}

export default RightBar;
