import { Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { realtime } from "../../shared/firebase";

const NotiWrapper = styled.div`
  display: inline;
  &:hover {
    cursor: pointer;
  }
`;

const NotiBadge = (props) => {
  const userId = useSelector((state) => state.user.user.uid);
  const [invisible, setInvisible] = useState(true);

  const notiCheck = () => {
    const notiDB = realtime.ref(`noti/${userId}`);
    notiDB.update({ read: true });
    props._onClick();
  };

  useEffect(() => {
    const notiDB = realtime.ref(`noti/${userId}`);

    notiDB.on("value", (snapshot) => {
      const visi = snapshot.val() !== null ? snapshot.val().read : true;
      setInvisible(visi);

      return () => notiDB.off();
    });
  }, [userId]);

  return (
    <NotiWrapper>
      <Badge
        color="warning"
        variant="dot"
        invisible={invisible}
        onClick={notiCheck}
      >
        <NotificationsIcon />
      </Badge>
    </NotiWrapper>
  );
};

NotiBadge.defaultProps = {
  _onClick: () => {},
};

export default NotiBadge;
