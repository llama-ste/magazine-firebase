import { Paper, Avatar } from "@mui/material";
import { red } from "@mui/material/colors";

import { history } from "../../store/configStore";

const NotificationItem = ({ username, postId, imageUrl }) => {
  return (
    <Paper
      sx={{ mb: 2, p: 2, display: "flex", alignItems: "center", gap: 2 }}
      elevation={2}
      onClick={() => history.push(`/post/${postId}`)}
    >
      <Avatar
        variant="square"
        src={imageUrl}
        sx={{ bgcolor: red[500] }}
        aria-label="recipe"
      ></Avatar>
      <span>
        <b>{username}</b>님이 게시글에 댓글을 남겼습니다.
      </span>
    </Paper>
  );
};

export default NotificationItem;
