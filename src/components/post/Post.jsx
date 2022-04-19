import { memo } from "react";
import styled, { css } from "styled-components";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch } from "react-redux";
import { useState } from "react";

import { history } from "../../store/configStore";
import { actionCreators as postActions } from "../../store/modules/post";
import { apiKey } from "../../shared/firebase";

const DetailPageLink = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const PostLayout = styled.div`
  ${({ layout }) =>
    layout === "left"
      ? css`
          display: flex;
        `
      : layout === "right" &&
        css`
          display: flex;
          flex-direction: row-reverse;
        `}
`;

const Post = memo((props) => {
  const {
    imageUrl,
    userInfo,
    insertDt,
    isMe,
    contents,
    commentCnt,
    id,
    layout,
    likeStatus,
    likeCnt,
  } = props;

  const dispatch = useDispatch();
  const [like, setLike] = useState(likeStatus);

  const sessionKey = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const hasSession = sessionStorage.getItem(sessionKey) ? true : false;

  const likeToggle = () => {
    if (!hasSession) {
      window.alert("로그인이 필요합니다.");
      return;
    }

    dispatch(postActions.likePostFB(id, like));
    setLike((state) => !state);
  };

  return (
    <Card sx={{ mb: 3 }} elevation={2}>
      <DetailPageLink onClick={() => history.push(`/post/${id}`)}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {userInfo.username[0].toUpperCase()}
            </Avatar>
          }
          title={userInfo.username}
          subheader={insertDt}
        />
        {layout === "top" && (
          <>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardMedia
                component="img"
                sx={{ height: "40vh", width: "100%", objectFit: "contain" }}
                image={imageUrl}
                alt="img"
              />
            </div>
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                {contents}
              </Typography>
            </CardContent>
          </>
        )}
        {layout === "left" && (
          <PostLayout layout={"left"}>
            <div style={{ width: "50%" }}>
              <CardMedia
                component="img"
                sx={{ height: "40vh", width: "100%", objectFit: "contain" }}
                image={imageUrl}
                alt="img"
              />
            </div>
            <CardContent sx={{ width: "50%" }}>
              <Typography variant="body1" color="text.secondary">
                {contents}
              </Typography>
            </CardContent>
          </PostLayout>
        )}
        {layout === "right" && (
          <PostLayout layout={"right"}>
            <div style={{ width: "50%" }}>
              <CardMedia
                component="img"
                sx={{ height: "40vh", width: "100%", objectFit: "contain" }}
                image={imageUrl}
                alt="img"
              />
            </div>
            <CardContent sx={{ width: "50%" }}>
              <Typography variant="body1" color="text.secondary">
                {contents}
              </Typography>
            </CardContent>
          </PostLayout>
        )}
        {layout === "bottom" && (
          <div>
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                {contents}
              </Typography>
            </CardContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardMedia
                component="img"
                sx={{ height: "40vh", width: "100%", objectFit: "contain" }}
                image={imageUrl}
                alt="img"
              />
            </div>
          </div>
        )}
      </DetailPageLink>
      <CardActions
        disableSpacing
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>댓글 {commentCnt}개 </span>
          <IconButton
            color={like ? "primary" : "default"}
            aria-label="like"
            onClick={likeToggle}
          >
            <FavoriteIcon />
          </IconButton>
          <span>{likeCnt}개</span>
        </div>
        {isMe && (
          <Button
            size="small"
            variant="contained"
            onClick={() => history.push(`/edit-post/${id}`)}
          >
            Edit
          </Button>
        )}
      </CardActions>
    </Card>
  );
});

export default Post;