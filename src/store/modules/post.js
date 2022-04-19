import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import moment from "moment";
import firebase from "firebase/app";

import { actionCreators as imageActions } from "./image";

// action type
const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const DELETE_POST = "DELETE_POST";
const LOADING = "LOADING";
const LIKE_POST = "LIKE_POST";

// action creators
const setPost = createAction(SET_POST, (postList, paging) => ({
  postList,
  paging,
}));
const addPost = createAction(ADD_POST, (post, layout) => ({ post, layout }));
const editPost = createAction(EDIT_POST, (postId, post) => ({
  postId,
  post,
}));
const deletePost = createAction(DELETE_POST, (postId) => ({ postId }));
const loading = createAction(LOADING, (isLoading) => ({ isLoading }));
const likePost = createAction(LIKE_POST, (postId, userId, likeStatus) => ({
  postId,
  userId,
  likeStatus,
}));

//initValue
const initialState = {
  list: [],
  paging: { start: null, next: null, size: 3 },
  isLoading: false,
};

const initialPost = {
  imageUrl: "",
  contents: "",
  layout: "top",
  commentCnt: 0,
  insertDt: moment().format("YYYY-MM-DD hh:mm:ss"),
  like: [],
  likeCnt: 0,
};

// middlewares
const likePostFB = (postId = null, likeStatus = false) => {
  return function (dispatch, getState, { history }) {
    const user = getState().user.user;

    const postRef = firestore.collection("post").doc(postId);

    if (!likeStatus) {
      const increment = firebase.firestore.FieldValue.increment(1);

      postRef
        .update({
          like: firebase.firestore.FieldValue.arrayUnion(user.uid),
          likeCnt: increment,
        })
        .then(() => {
          dispatch(likePost(postId, user.uid, true));
        });
    } else {
      const decrement = firebase.firestore.FieldValue.increment(-1);

      postRef
        .update({
          like: firebase.firestore.FieldValue.arrayRemove(user.uid),
          likeCnt: decrement,
        })
        .then(() => {
          dispatch(likePost(postId, user.uid, false));
        });
    }
  };
};

const addPostFB = (contents = "", layout = "top") => {
  return function (dispatch, getState, { history }) {
    dispatch(loading(true));

    const postDB = firestore.collection("post");
    const user = getState().user.user;

    const userInfo = {
      username: user.username,
      userId: user.uid,
      userProfile: user.userProfile,
    };

    const post = {
      ...initialPost,
      contents,
      layout,
      insertDt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    const image = getState().image.preview;

    const upload = storage
      .ref(`images/${userInfo.userId}_${new Date().getTime()}`)
      .putString(image, "data_url");

    upload
      .then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            return url;
          })
          .then((url) => {
            postDB
              .add({ ...userInfo, ...post, imageUrl: url })
              .then((doc) => {
                const reduxPost = {
                  userInfo,
                  ...post,
                  id: doc.id,
                  imageUrl: url,
                };
                dispatch(addPost(reduxPost));
                history.replace("/");

                dispatch(imageActions.setPreview(null));
              })
              .catch((err) => {
                dispatch(loading(false));
                window.alert("포스트 작성에 문제가 있어요!");
                console.log("포스트 작성에 실패했어요!", err.message);
              });
          });
      })
      .catch((err) => {
        dispatch(loading(false));
        window.alert("이미지 업로드에 문제가 있어요!");
        console.log("이미지 업로드에 문제가 있어요!", err.message);
      });
  };
};

const getPostFB = (start = null, size = 4) => {
  return function (dispatch, getState) {
    const paging = getState().post.paging;

    if (paging.start && !paging.next) {
      return;
    }

    dispatch(loading(true));

    const postDB = firestore.collection("post");
    let query = postDB.orderBy("insertDt", "desc");

    if (start) {
      query = query.startAt(start);
    }

    query
      .limit(size + 1)
      .get()
      .then((docs) => {
        const postList = [];

        const paging = {
          start: docs.docs[0],
          next:
            docs.docs.length === size + 1
              ? docs.docs[docs.docs.length - 1]
              : null,
          size: size,
        };

        docs.forEach((doc) => {
          const _post = doc.data();

          const post = Object.keys(_post).reduce(
            (acc, cur) => {
              if (cur.indexOf("user") !== -1) {
                return {
                  ...acc,
                  userInfo: { ...acc.userInfo, [cur]: _post[cur] },
                };
              }
              return { ...acc, [cur]: _post[cur] };
            },
            { id: doc.id, userInfo: {} }
          );

          postList.push(post);
        });

        if (paging.next) {
          postList.pop();
        }

        dispatch(setPost(postList, paging));
      });
  };
};

const getOnePostFB = (id) => {
  return function (dispatch) {
    const postDB = firestore.collection("post");

    postDB
      .doc(id)
      .get()
      .then((doc) => {
        const _post = doc.data();
        const post = Object.keys(_post).reduce(
          (acc, cur) => {
            if (cur.indexOf("user") !== -1) {
              return {
                ...acc,
                userInfo: { ...acc.userInfo, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, userInfo: {} }
        );

        dispatch(setPost([post]));
      });
  };
};

const editPostFB = (postId = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!postId) {
      console.log("게시물 정보가 없어요!");
      return;
    }
    dispatch(loading(true));

    const image = getState().image.preview;

    const postIdx = getState().post.list.findIndex((p) => p.id === postId);
    const _post = getState().post.list[postIdx];

    const postDB = firestore.collection("post");

    if (image === _post.imageUrl) {
      postDB
        .doc(postId)
        .update(post)
        .then(() => {
          dispatch(editPost(postId, { ...post }));
          history.replace("/");
        });
      return;
    } else {
      const userId = getState().user.user.uid;
      const upload = storage
        .ref(`images/${userId}_${new Date().getTime()}`)
        .putString(image, "data_url");

      upload.then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            return url;
          })
          .then((url) => {
            postDB
              .doc(postId)
              .update({ ...post, imageUrl: url })
              .then(() => {
                dispatch(editPost(postId, { ...post, imageUrl: url }));
                history.replace("/");
              });
          })
          .catch((err) => {
            window.alert("이미지 업로드에 문제가 있어요!");
            dispatch(loading(false));
            console.log("이미지 업로드에 문제가 있어요!", err.message);
          });
      });
    }
  };
};

const deletePostFB = (id) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    const commentDB = firestore.collection("comment");

    postDB
      .doc(id)
      .delete()
      .then(() => {
        history.replace("/");
        commentDB
          .get()
          .then((docs) => {
            docs.forEach((doc) => {
              if (doc.data().postId === id) {
                commentDB.doc(doc.id).delete();
              }
            });
          })
          .then(() => {
            dispatch(deletePost(id));
          });
      });
  };
};

// reducer
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.postList);

        draft.list = draft.list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.id === cur.id) === -1) {
            return [...acc, cur];
          } else {
            acc[acc.findIndex((a) => a.id === cur.id)] = cur;
            return acc;
          }
        }, []);

        if (action.payload.paging) {
          draft.paging = action.payload.paging;
        }

        draft.isLoading = false;
      }),
    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
        draft.isLoading = false;
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.postId);
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
        draft.isLoading = false;
      }),
    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        const delList = draft.list.findIndex(
          (p) => p.id === action.payload.postId
        );

        if (delList !== -1) {
          draft.list.splice(delList, 1);
        }

        // draft.list.filter((p) => {
        //   return p.id !== action.payload.postId;
        // });
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.isLoading = action.payload.isLoading;
      }),
    [LIKE_POST]: (state, action) =>
      produce(state, (draft) => {
        const userId = action.payload.userId;

        const idx = draft.list.findIndex((p) => p.id === action.payload.postId);

        if (action.payload.likeStatus) {
          draft.list[idx].like.push(userId);
          draft.list[idx].likeCnt += 1;
        } else {
          const delList = draft.list[idx].like.findIndex((p) => p === userId);

          if (delList !== -1) {
            draft.list[idx].like.splice(delList, 1);
          }

          draft.list[idx].likeCnt -= 1;
        }
      }),
  },
  initialState
);

const actionCreators = {
  addPostFB,
  getPostFB,
  getOnePostFB,
  editPostFB,
  likePostFB,
  deletePostFB,
  addPost,
  editPost,
  setPost,
};

export { actionCreators };
