import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import Post from "../components/post/Post";
import { actionCreators as postActions } from "../store/modules/post";
import CommentForm from "../components/comment/CommentForm";

import { apiKey } from "../shared/firebase";
import CommentList from "../components/comment/CommentList";

const PostDetail = (props) => {
  const dispatch = useDispatch();
  const id = props.match.params.id;

  const userInfo = useSelector((state) => state.user.user);
  const postList = useSelector((state) => state.post.list);
  const postIndex = postList.findIndex((post) => post.id === id);
  const post = postList[postIndex];

  const sessionKey = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const hasSession = sessionStorage.getItem(sessionKey) ? true : false;

  useEffect(() => {
    if (post) {
      return;
    }
    dispatch(postActions.getOnePostFB(id));
  }, [dispatch, id, post]);

  let likeStatus = false;

  if (post && userInfo && post.like.indexOf(userInfo.uid) !== -1) {
    likeStatus = true;
  }

  return (
    <>
      {post && (
        <Post
          {...post}
          isMe={post.userInfo.userId === userInfo?.uid}
          likeStatus={likeStatus}
        />
      )}
      {hasSession && <CommentForm postId={id} />}
      <CommentList postId={id} />
    </>
  );
};

export default PostDetail;
