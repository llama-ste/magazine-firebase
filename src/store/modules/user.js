import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

import { setCookie, deleteCookie } from "../../shared/cookie";
import { auth } from "../../shared/firebase";
import firebase from "firebase/app";

// actions
const LOG_OUT = "LOG_OUT";
const SET_USER = "SET_USER";
// const GET_USER = "GET_USER";

// action creators
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));
// const getUser = createAction(GET_USER, (user) => ({ user }));

// initialState
const initialState = {
  user: null,
  isLogin: false,
};

const signupFB = (id, pwd, username) => {
  return function (dispatch, getState, { history }) {
    auth
      .createUserWithEmailAndPassword(id, pwd)
      .then((user) => {
        auth.currentUser
          .updateProfile({
            displayName: username,
          })
          .then(() => {
            dispatch(
              setUser({
                username,
                id,
                userProfile: "",
                uid: user.user.uid,
              })
            );
            history.push("/");
          })
          .catch((err) => {
            console.log(err.code, err.message);
          });
      })
      .catch((err) => {
        console.log(err.code, err.message);
      });
  };
};

const loginFB = (id, pwd) => {
  return function (dispatch, getState, { history }) {
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
      auth
        .signInWithEmailAndPassword(id, pwd)
        .then((user) => {
          dispatch(
            setUser({
              username: user.user.displayName,
              id,
              userProfile: "",
              uid: user.user.uid,
            })
          );
          history.push("/");
        })
        .catch((err) => {
          window.alert("존재하지 않는 아이디입니다.");
          console.log(err.message);
        });
    });
  };
};

const loginCheckFB = () => {
  return function (dispatch) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          setUser({
            username: user.displayName,
            userProfile: "",
            id: user.email,
            uid: user.uid,
          })
        );
      } else {
        dispatch(logOut());
      }
    });
  };
};

const logoutFB = () => {
  return function (dispatch, getState, { history }) {
    auth.signOut().then(() => {
      dispatch(logOut());
      history.replace("/");
    });
  };
};

export default handleActions(
  {
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        setCookie("isLogin", "success");
        draft.user = action.payload.user;
        draft.isLogin = true;
      }),
    [LOG_OUT]: (state) =>
      produce(state, (draft) => {
        deleteCookie("isLogin");
        draft.user = null;
        draft.isLogin = false;
      }),
  },
  initialState
);

const actionCreators = {
  signupFB,
  loginFB,
  logoutFB,
  loginCheckFB,
};

export { actionCreators };
