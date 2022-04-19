import styled from "styled-components";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";

import { history } from "../store/configStore";
import { apiKey } from "../shared/firebase";
import { actionCreators as userActions } from "../store/modules/user";
import NotiBadge from "./notification/NotiBadge";

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    &:hover {
      cursor: pointer;
    }
  }
`;

const Header = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);

  const sessionKey = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const hasSession = sessionStorage.getItem(sessionKey) ? true : false;

  return (
    <StyledHeader>
      <h3 onClick={() => history.push("/")}>llama's magazine</h3>
      {isLogin && hasSession ? (
        <div>
          <NotiBadge
            _onClick={() => {
              history.push("/notification");
            }}
          />
          <Button
            onClick={() => dispatch(userActions.logoutFB())}
            sx={{ fontWeight: 900 }}
            size="large"
          >
            로그아웃
          </Button>
        </div>
      ) : (
        <div>
          <Button
            onClick={() => history.push("/signup")}
            sx={{ fontWeight: 900 }}
            size="large"
          >
            회원가입
          </Button>
          <Button
            onClick={() => history.push("/login")}
            sx={{ fontWeight: 900, ml: 1 }}
            size="large"
          >
            로그인
          </Button>
        </div>
      )}
    </StyledHeader>
  );
};

export default Header;
