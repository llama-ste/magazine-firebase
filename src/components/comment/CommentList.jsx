import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { actionCreators as commentActions } from "../../store/modules/comment";
import Comment from "./Comment";

const CommentList = ({ postId }) => {
  const dispatch = useDispatch();
  const reduxCommentList = useSelector((state) => state.comment.list);

  useEffect(() => {
    if (!reduxCommentList[postId]) {
      dispatch(commentActions.getCommentFB(postId));
    }
  }, [dispatch, reduxCommentList, postId]);

  if (!reduxCommentList[postId] || !postId) {
    return null;
  }

  return (
    <>
      {reduxCommentList[postId].map((comment) => {
        return <Comment key={comment.id} {...comment} />;
      })}
    </>
  );
};

export default CommentList;
