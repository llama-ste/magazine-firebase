import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";

import { actionCreators as userActions } from "../store/modules/user";
import { apiKey } from "../shared/firebase";
import { history } from "../store/configStore";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;

  h1 {
    margin-bottom: 0px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    max-width: 300px;
    width: 100%;
  }
`;

const Login = () => {
  const dispatch = useDispatch();

  const sessionKey = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const hasSession = sessionStorage.getItem(sessionKey) ? true : false;

  if (hasSession) {
    window.alert("이미 로그인이 되어있습니다.");
    history.replace("/");
  }

  const {
    handleSubmit,
    control,
    formState: { dirtyFields },
  } = useForm({
    mode: "onChange",
  });

  const submitHandler = ({ id, pwd }) => {
    dispatch(userActions.loginFB(id, pwd));
  };

  return (
    <StyledForm onSubmit={handleSubmit(submitHandler)}>
      <h1>로그인</h1>
      <div className="input-group">
        {/* https://levelup.gitconnected.com/using-react-hook-form-with-material-ui-components-ba42ace9507a */}
        <Controller
          name="id"
          control={control}
          defaultValue=""
          rules={{
            required: "아이디는 필수입니다!",
            pattern: {
              value:
                /^[0-9a-zA-Z]([-_.0-9a-zA-Z])*@[0-9a-zA-Z]([-_.0-9a-zA-z])*.([a-zA-Z])*/,
              message: "올바르지 않은 형식의 이메일입니다!",
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              fullWidth
              placeholder="이메일"
              label="ID"
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />

        <Controller
          name="pwd"
          control={control}
          defaultValue=""
          rules={{
            required: "비밀번호는 필수입니다!",
            pattern: {
              value:
                /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/,
              message: "올바르지 않은 형식의 비밀번호입니다!",
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              fullWidth
              label="Password"
              value={value}
              type="password"
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
      </div>
      <Button
        sx={{ fontWeight: 900 }}
        variant="contained"
        size="large"
        type="submit"
        disabled={!(dirtyFields?.id && dirtyFields?.pwd)}
      >
        로그인하기
      </Button>
    </StyledForm>
  );
};

export default Login;
