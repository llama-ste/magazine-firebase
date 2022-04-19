import styled from "styled-components";
import Button from "@mui/material/Button";

import { history } from "../store/configStore";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
`;

const NotFound = () => {
  return (
    <Box>
      <h1>존재하지 않는 페이지 입니다!</h1>
      <Button
        sx={{ fontWeight: 900 }}
        size="large"
        variant="contained"
        onClick={() => history.replace("/")}
      >
        홈페이지로 가기
      </Button>
    </Box>
  );
};

export default NotFound;
