import styled from "styled-components";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { history } from "../store/configStore";
import { apiKey } from "../shared/firebase";
import { actionCreators as postActions } from "../store/modules/post";
import Post from "../components/post/Post";
import InfinityScroll from "../shared/InfinityScroll";

const ListWrapper = styled.div`
  .addBtn {
    position: fixed;
    bottom: 50px;
    right: 50px;
  }
`;

const PostList = () => {
  const dispatch = useDispatch();
  const postList = useSelector((state) => state.post.list);
  const userInfo = useSelector((state) => state.user.user);
  const isLoading = useSelector((state) => state.post.isLoading);
  const paging = useSelector((state) => state.post.paging);

  const sessionKey = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const hasSession = sessionStorage.getItem(sessionKey) ? true : false;

  useEffect(() => {
    if (postList.length < 2) {
      dispatch(postActions.getPostFB());
    }
  }, [dispatch, postList]);

  return (
    <ListWrapper>
      <InfinityScroll
        callNext={() => {
          dispatch(postActions.getPostFB(paging.next));
        }}
        isNext={paging.next ? true : false}
        loading={isLoading}
      >
        {postList.length !== 0 &&
          postList.map((p) => {
            let likeStatus = false;

            if (p.like.indexOf(userInfo?.uid) !== -1) {
              likeStatus = true;
            }

            if (p.userInfo.userId === userInfo?.uid) {
              return (
                <Post key={p.id} {...p} isMe={true} likeStatus={likeStatus} />
              );
            } else {
              return <Post key={p.id} {...p} likeStatus={likeStatus} />;
            }
          })}
      </InfinityScroll>
      {hasSession && (
        <Fab
          onClick={() => history.push("/new-post")}
          className="addBtn"
          color="primary"
          aria-label="add"
        >
          <AddIcon fontSize="large" />
        </Fab>
      )}
    </ListWrapper>
  );
};

export default PostList;
