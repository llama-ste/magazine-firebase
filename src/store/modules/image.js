import { createAction, handleActions } from "redux-actions";
import produce from "immer";

import { storage } from "../../shared/firebase";

const IS_UPLOADING = "IS_UPLOADING";
const UPLOAD_IMAGE = "UPLOAD_IMAGE";
const SET_PREVIEW = "SET_PREVIEW";

const isUploading = createAction(IS_UPLOADING, (isUploading) => ({
  isUploading,
}));
const uploadImage = createAction(UPLOAD_IMAGE, (imageUrl) => ({ imageUrl }));
const setPreview = createAction(SET_PREVIEW, (preview) => ({ preview }));

const initialState = {
  imageUrl: "",
  isUploading: false,
  preview: null,
};

const uploadImageFB = (image) => {
  return function (dispatch) {
    dispatch(isUploading(true));

    const upload = storage.ref(`images/${image.name}`).put(image);

    upload.then((snapshot) => {
      snapshot.ref.getDownloadURL().then((url) => {
        dispatch(uploadImage(url));
      });
    });
  };
};

export default handleActions(
  {
    [UPLOAD_IMAGE]: (state, action) =>
      produce(state, (draft) => {
        draft.imageUrl = action.payload.imageUrl;
        draft.isUploading = false;
      }),
    [IS_UPLOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.isUploading = action.payload.isUploading;
      }),
    [SET_PREVIEW]: (state, action) =>
      produce(state, (draft) => {
        draft.preview = action.payload.preview;
      }),
  },
  initialState
);

const actionCreators = {
  uploadImage,
  uploadImageFB,
  setPreview,
};

export { actionCreators };
