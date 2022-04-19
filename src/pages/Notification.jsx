import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import NotificationItem from "../components/notification/NotificationItem";
import { realtime } from "../shared/firebase";
import { history } from "../store/configStore";

const Notification = () => {
  const user = useSelector((state) => state.user.user);
  const [notiList, setNotiList] = useState([]);

  useEffect(() => {
    if (!user) {
      window.alert("로그인이 필요합니다.");
      history.replace("/login");
      return;
    }

    const notiDB = realtime.ref(`noti/${user.uid}/list`);
    const noti = notiDB.orderByChild("insert_dt");

    noti.once("value", (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const _notiList = Object.keys(data)
          .reverse()
          .map((s) => {
            return data[s];
          });

        setNotiList(_notiList);
      }
    });
  }, [user]);
  return (
    <>
      {notiList.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <h1>알림이 없습니다.</h1>
          <Button
            sx={{ fontWeight: 900 }}
            variant="contained"
            onClick={() => history.push("/")}
          >
            홈으로 가기
          </Button>
        </div>
      ) : (
        notiList.map((n, idx) => {
          return <NotificationItem key={`noti_${idx}`} {...n} />;
        })
      )}
    </>
  );
};

export default Notification;
