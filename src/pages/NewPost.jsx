import PostForm from "../components/post/PostForm";

const NewPost = (props) => {
  const postId = props.match.params.id;

  return (
    <>
      <PostForm postId={postId} />
    </>
  );
};

export default NewPost;
