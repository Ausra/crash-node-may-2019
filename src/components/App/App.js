import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [comments, setComments] = useState([]);
  const [commentCount, setCommmentCount] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    const getComments = async () => {
      const result = await axios.get('/comments');
      setComments(result.data);
    };
    getComments();
  }, [commentCount]);

  const addComment = async () => {
    await axios.post('/comments', { author: name, text: comment });
    setCommmentCount(oldCommentCount => oldCommentCount + 1);
  };

  return (
    <div>
      <div id="comments-list" />
      {comments.map(({ author, text }, index) => (
        <div key={index} data-testid={index}>
          {author}: {text}
        </div>
      ))}
      <div>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          id="comment"
          type="text"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button id="add-button" onClick={addComment}>
          Add Comment
        </button>
      </div>
    </div>
  );
}

export default App;
