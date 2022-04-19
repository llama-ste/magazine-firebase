import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, realtime } from "../../shared/firebase";
import moment from "moment";

import firebase from "firebase/app";

import { actionCreators as postActions } from "./post";

const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";
const LOADING = "LOADING";

const setComment = createAction(SET_COMMENT, (postId, commentList) => ({
  postId,
  commentList,
}));
const addComment = createAction(ADD_COMMENT, (postId, comment) => ({
  postId,
  comment,
}));

// const loading = createAction(LOADING, (isLoading) => ({ isLoading }));

const initialState = {
  list: {},
  isLoading: false,
};

const addCommentFB = (postId, contents) => {
  return function (dispatch, getState) {
    const commentDB = firestore.collection("comment");
    const userInfo = getState().user.user;

    let comment = {
      postId,
      userId: userInfo.uid,
      username: userInfo.username,
      userProfile: userInfo.userProfile,
      contents,
      insertDt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    commentDB.add(comment).then((doc) => {
      const postDB = firestore.collection("post");

      const post = getState().post.list.find((l) => l.id === postId);
      const increment = firebase.firestore.FieldValue.increment(1);
      comment = { ...comment, id: doc.id };

      postDB
        .doc(postId)
        .update({ commentCnt: increment })
        .then((_post) => {
          dispatch(addComment(postId, comment));

          if (post) {
            dispatch(
              postActions.editPost(postId, {
                commentCnt: parseInt(post.commentCnt) + 1,
              })
            );

            const notiItem = realtime
              .ref(`noti/${post.userInfo.userId}/list`)
              .push();

            if (post.userInfo.userId === userInfo.uid) {
              return;
            }

            notiItem.set(
              {
                postId,
                username: comment.username,
                imageUrl: post.imageUrl,
                insertDt: comment.insertDt,
              },
              (err) => {
                if (err) {
                  console.log("알림 저장에 실패했어요!");
                } else {
                  const notiDB = realtime.ref(`noti/${post.userInfo.userId}`);

                  notiDB.update({ read: false });
                }
              }
            );
          }
        });
    });
  };
};

const getCommentFB = (postId = null) => {
  return function (dispatch) {
    if (!postId) {
      return;
    }

    const commentDB = firestore.collection("comment");

    commentDB
      .where("postId", "==", postId)
      .orderBy("insertDt", "desc")
      .get()
      .then((docs) => {
        const list = [];

        docs.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });

        dispatch(setComment(postId, list));
      })
      .catch((err) => {
        console.log("댓글 정보를 가져올 수가 없네요!", err.message);
      });
  };
};

export default handleActions(
  {
    [SET_COMMENT]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.postId] = action.payload.commentList;
      }),
    [ADD_COMMENT]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.postId].unshift(action.payload.comment);
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.isLoading = action.payload.isLoading;
      }),
  },
  initialState
);

const actionCreators = {
  getCommentFB,
  addCommentFB,
  setComment,
  addComment,
};

export { actionCreators };
