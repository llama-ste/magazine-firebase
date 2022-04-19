import { useCallback, useEffect } from "react";
import _ from "lodash";
import CircularProgress from "@mui/material/CircularProgress";

const InfinityScroll = (props) => {
  const { children, callNext, isNext, loading } = props;

  const _handleScroll = _.throttle(() => {
    if (loading) {
      return;
    }

    const { innerHeight } = window;
    const { scrollHeight } = document.body;

    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;

    if (scrollHeight - innerHeight - scrollTop < 200) {
      callNext();
    }
  }, 300);

  const handleScroll = useCallback(_handleScroll, [loading, _handleScroll]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isNext) {
      window.addEventListener("scroll", handleScroll);
    } else {
      window.removeEventListener("scroll", handleScroll);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isNext, loading, handleScroll]);

  return (
    <>
      {children}
      <div style={{ textAlign: "center", margin: "30px 0px" }}>
        {isNext && <CircularProgress color="inherit" />}
      </div>
    </>
  );
};

InfinityScroll.defaultProps = {
  children: null,
  callNext: () => {},
  isNext: false,
  loading: false,
};

export default InfinityScroll;
