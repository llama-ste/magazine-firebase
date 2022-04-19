import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import Button from "@mui/material/Button";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import { actionCreators as imageActions } from "../store/modules/image";

const ImageUpload = () => {
  const dispatch = useDispatch();
  const isUploading = useSelector((state) => state.image.isUploading);
  const fileInputRef = useRef();

  const selectFile = () => {
    const reader = new FileReader();
    const file = fileInputRef.current.files[0];

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      dispatch(imageActions.setPreview(reader.result));
    };
  };

  return (
    <>
      <Button
        sx={{ fontWeight: 900 }}
        variant="contained"
        component="label"
        endIcon={<PhotoCamera />}
      >
        Upload Image
        <input
          accept="image/*"
          type="file"
          onChange={selectFile}
          ref={fileInputRef}
          disabled={isUploading}
          hidden
        />
      </Button>
    </>
  );
};

export default ImageUpload;
