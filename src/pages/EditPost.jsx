import PostForm from "../components/post/PostForm";

const EditPost = (props) => {
  const postId = props.match.params.id;
  return (
    <>
      <PostForm postId={postId} />
    </>
  );
};

export default EditPost;
