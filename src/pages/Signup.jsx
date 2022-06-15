import styled from "styled-components";
import { TextField, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";

import { actionCreators as userActions } from "../store/modules/user";
import { history } from "../store/configStore";
import { apiKey } from "../shared/firebase";

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

const Signup = () => {
  const dispatch = useDispatch();

  const sessionKey = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const hasSession = sessionStorage.getItem(sessionKey) ? true : false;

  if (hasSession) {
    window.alert("이미 로그인이 되어있습니다.");
    history.replace("/");
  }

  const { handleSubmit, control } = useForm();

  const submitHandler = ({ id, nickname, pwd, pwdConfirm }) => {
    console.log(id, nickname, pwd, pwdConfirm);
    if (pwd !== pwdConfirm) {
      window.alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    dispatch(userActions.signupFB(id, pwd, nickname));
  };

  return (
    <StyledForm onSubmit={handleSubmit(submitHandler)}>
      <h1>회원가입</h1>
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
              label="Email"
              value={value}
              placeholder="이메일"
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
        <Controller
          name="nickname"
          control={control}
          defaultValue=""
          rules={{
            required: "닉네임은 필수입니다!",
            pattern: {
              value: /^[a-zA-Zㄱ-힣0-9-_.]{2,12}$/,
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              fullWidth
              label="Nickname"
              value={value}
              placeholder="영문, 한글 2 ~ 12자"
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
              placeholder="숫자, 대소문자, 특수기호를 포함 8 ~ 16자"
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
        <Controller
          name="pwdConfirm"
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
              label="Password confirmation"
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
        type="submit"
        variant="contained"
        size="large"
      >
        회원가입하기
      </Button>
    </StyledForm>
  );
};

export default Signup;
