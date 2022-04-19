import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";

const Comment = (props) => {
  const { username, contents, insertDt } = props;

  return (
    <Paper
      sx={{
        mb: 2,
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      elevation={2}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
          {username[0].toUpperCase()}
        </Avatar>
        <b>{username}</b>
        <span>{contents}</span>
      </div>
      <span>{insertDt}</span>
    </Paper>
  );
};

export default Comment;
