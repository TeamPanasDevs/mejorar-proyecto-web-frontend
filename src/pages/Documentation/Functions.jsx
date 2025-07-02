import React from 'react';

export function themeClicked(id) {
  const content = document.getElementById(id);
  const head = document.getElementById(`head_${id}`);
  const button = document.getElementById(`button_${id}`);

  // Expand content
  if (content.className === 'content collapsed') {
    content.className = 'content';
    head.style.backgroundColor = '#d9d9d9'
    button.style.backgroundImage = "url('https://cdn1.iconfinder.com/data/icons/arrows-vol-1-5/24/Collapse_arrow2-512.png')";
  }
  // Collapse content
  else {
    content.className = 'content collapsed';
    head.style.backgroundColor = null;
    button.style.backgroundImage = "url('https://cdn-icons-png.freepik.com/512/14035/14035161.png')";
  }
}