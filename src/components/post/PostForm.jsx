import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import {
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";

import { history } from "../../store/configStore";
import ImageUpload from "../../shared/ImageUpload";
import { actionCreators as imageActions } from "../../store/modules/image";
import { actionCreators as postActions } from "../../store/modules/post";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
  h3 {
    margin: 0px;
  }
`;

const LayoutWrapper = styled.div`
  width: 100%;

  ${({ layout }) =>
    layout === "left"
      ? css`
          display: flex;
          gap: 20px;
        `
      : layout === "right" &&
        css`
          display: flex;
          flex-direction: row-reverse;
          gap: 20px;
        `}
`;

const Preview = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: lightgray;

  border: 1px dashed lightgray;
  width: 100%;
  min-height: 300px;
  max-height: 50vh;
  background-image: url(${({ url }) => url && url});
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 100%;
`;

const PostForm = ({ postId }) => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);
  const preview = useSelector((state) => state.image.preview);
  const postList = useSelector((state) => state.post.list);
  const isLoading = useSelector((state) => state.post.isLoading);

  const isEdit = postId ? true : false;
  const post = isEdit ? postList.find((p) => p.id === postId) : null;

  const [layout, setLayout] = useState(post ? post.layout : "top");
  const [contents, setContents] = useState(post ? post.contents : "");

  useEffect(() => {
    if (isEdit && !post) {
      window.alert("포스트 정보가 없어요!");
      history.goBack();
      return;
    }

    if (isEdit) {
      dispatch(imageActions.setPreview(post.imageUrl));
      setLayout(post.layout);
      setContents(post.contents);
    }

    return () => dispatch(imageActions.setPreview(null));
  }, [dispatch, isEdit, post]);

  const changeContentsHandler = (e) => {
    setContents(e.target.value);
  };

  const addPostHandler = () => {
    dispatch(postActions.addPostFB(contents, layout));
  };

  const editPostHandler = () => {
    dispatch(postActions.editPostFB(postId, { contents, layout }));
  };

  const deletePostHandler = () => {
    dispatch(postActions.deletePostFB(postId));
  };

  return (
    <StyledForm>
      {!isLogin ? (
        <>
          <h1>로그인 후에만 글을 쓸 수 있어요.</h1>
          <Button
            onClick={() => history.replace("/login")}
            sx={{ mb: 3 }}
            variant="contained"
            size="large"
          >
            로그인 하러가기
          </Button>
        </>
      ) : (
        <>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
                gap: "20px",
              }}
            >
              <CircularProgress />
              <b>Loading...</b>
            </div>
          ) : (
            <>
              <h3>{isEdit ? "게시글 수정" : "게시글 작성"}</h3>

              <ImageUpload />
              <ToggleButtonGroup
                color="primary"
                value={layout}
                exclusive
                onChange={(e) => {
                  setLayout(e.target.value);
                }}
              >
                <ToggleButton value="top">이미지 위</ToggleButton>
                <ToggleButton value="bottom">이미지 아래</ToggleButton>
                <ToggleButton value="left">이미지 왼쪽</ToggleButton>
                <ToggleButton value="right">이미지 오른쪽</ToggleButton>
              </ToggleButtonGroup>
              {layout === "top" && (
                <LayoutWrapper layout={layout}>
                  <Preview url={preview}>
                    {preview === null && <span>이미지 미리보기</span>}
                  </Preview>
                  <TextField
                    value={contents}
                    sx={{ mt: 3, height: "100%" }}
                    multiline
                    minRows={5}
                    fullWidth
                    onChange={changeContentsHandler}
                    label="게시글 내용"
                    id="contents"
                  />
                </LayoutWrapper>
              )}
              {layout === "left" && (
                <LayoutWrapper layout={layout}>
                  <Preview url={preview}>
                    {preview === null && <span>이미지 미리보기</span>}
                  </Preview>
                  <TextField
                    value={contents}
                    multiline
                    sx={{ height: "100%" }}
                    minRows={5}
                    fullWidth
                    onChange={changeContentsHandler}
                    label="게시글 내용"
                    id="contents"
                  />
                </LayoutWrapper>
              )}
              {layout === "right" && (
                <LayoutWrapper layout={layout}>
                  <Preview url={preview}>
                    {preview === null && <span>이미지 미리보기</span>}
                  </Preview>
                  <TextField
                    value={contents}
                    multiline
                    rows={5}
                    fullWidth
                    onChange={changeContentsHandler}
                    label="게시글 내용"
                    id="contents"
                  />
                </LayoutWrapper>
              )}
              {layout === "bottom" && (
                <LayoutWrapper layout={layout}>
                  <TextField
                    value={contents}
                    sx={{ mb: 3 }}
                    multiline
                    rows={5}
                    fullWidth
                    onChange={changeContentsHandler}
                    label="게시글 내용"
                    id="contents"
                  />
                  <Preview url={preview}>
                    {preview === null && <span>이미지 미리보기</span>}
                  </Preview>
                </LayoutWrapper>
              )}
              {isEdit ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button
                    onClick={deletePostHandler}
                    variant="contained"
                    size="large"
                    color="warning"
                  >
                    게시글 삭제
                  </Button>
                  <Button
                    onClick={editPostHandler}
                    variant="contained"
                    size="large"
                  >
                    게시글 수정
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={addPostHandler}
                  variant="contained"
                  size="large"
                  disabled={preview === null || contents.length === 0}
                >
                  게시글 작성
                </Button>
              )}
            </>
          )}
        </>
      )}
    </StyledForm>
  );
};

export default PostForm;
