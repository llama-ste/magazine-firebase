import { Switch, Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import Container from "@mui/material/Container";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { actionCreators as userActions } from "./store/modules/user";
import { apiKey } from "./shared/firebase";
import { history } from "./store/configStore";

import Header from "./components/Header";
import PostList from "./pages/PostList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NewPost from "./pages/NewPost";
import EditPost from "./pages/EditPost";
import PostDetail from "./pages/PostDetail";
import Notification from "./pages/Notification";
import NotFound from "./pages/NotFound";

function App() {
  const dispatch = useDispatch();

  const sessionKey = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const hasSession = sessionStorage.getItem(sessionKey) ? true : false;

  useEffect(() => {
    if (hasSession) {
      dispatch(userActions.loginCheckFB());
    }
  }, [dispatch, hasSession]);

  return (
    <Container maxWidth="sm">
      <Header />
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/" exact component={PostList} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/new-post" exact component={NewPost} />
          <Route path="/edit-post/:id" exact component={EditPost} />
          <Route path="/post/:id" exact component={PostDetail} />
          <Route path="/notification" exact component={Notification} />
          <Route path="*" exact component={NotFound} />
        </Switch>
      </ConnectedRouter>
    </Container>
  );
}

export default App;
