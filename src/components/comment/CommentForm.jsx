import styled from "styled-components";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { TextField, Button } from "@mui/material";

import { actionCreators as commentActions } from "../../store/modules/comment";

const StyledForm = styled.form`
  display: flex;
  margin-bottom: 16px;
`;

const CommentForm = ({ postId }) => {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");

  const changeCommentHandler = (e) => {
    setCommentText(e.target.value);
  };

  const addCommentHandler = () => {
    dispatch(commentActions.addCommentFB(postId, commentText));
    setCommentText("");
  };

  return (
    <StyledForm onSubmit={(e) => e.preventDefault()}>
      <TextField
        onChange={changeCommentHandler}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            addCommentHandler();
          }
        }}
        value={commentText}
        fullWidth
        label="댓글"
        id="comment"
      />
      <Button onClick={addCommentHandler} variant="contained">
        작성
      </Button>
    </StyledForm>
  );
};

export default CommentForm;
