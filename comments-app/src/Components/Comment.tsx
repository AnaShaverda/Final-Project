import { useState } from "react";
import NewComment from "./NewComment";
import Reply from "./Reply";
import ReplyIcon from "@mui/icons-material/Reply";
import styles from "./Comment.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface User {
  image: {
    png: string;
    webp: string;
  };
  username: string;
}
interface CommentReply {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  replyingTo?: string;
  user: User;
}
interface CommentProps {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: User;
  currentUser: User;
  replies: CommentReply[];
  activeComment: { id: number; type: string } | null;
  updateComment: (text: string, id: number) => void;
  setActiveComment: (
    activeComment: { id: number; type: string } | null
  ) => void;
  deleteComment: (id: number) => void;
}



export default function Comment(props: CommentProps) {
  const [score, setScore] = useState<number>(props.score);
    const [userVote, setUserVote] = useState<'increase' | 'decrease' | null>(null);
  const [backendReplies, setBackendReplies] = useState<CommentReply[]>(props.replies);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const isCurrentUser: boolean =
    props.user.username === props.currentUser.username;
  const isReplying: boolean = !!(
    props.activeComment &&
    props.activeComment.id === props.id &&
    props.activeComment.type === "replying"
  );

  const isEditing: boolean = !!(
    props.activeComment &&
    props.activeComment.id === props.id &&
    props.activeComment.type === "editing"
  );
  const handleDelete = () => {
    props.deleteComment(props.id);
    setShowDeleteModal(false);
  };

  const handleUpdate = (text: string) => {
    props.updateComment(text, props.id);
    props.setActiveComment(null);
  };

const handleScoreChange = (action: 'increase' | 'decrease') => {
  if (action === 'increase') {
    if (score === props.score + 1) return;
    setScore((prevScore) => prevScore + 1);
    setUserVote('increase');
  } else { 
    if (score === props.score - 1) return; 
    setScore((prevScore) => prevScore - 1);
    setUserVote('decrease');
  }
};

  const addReply = (text: string) => {
    const newReply: CommentReply = {
      id: Date.now(),
      content: text,
      createdAt: "Just now",
      score: 0,
      replyingTo: props.user.username,
      user: props.currentUser,
    };
    setBackendReplies([newReply, ...backendReplies]);
    props.setActiveComment(null);
  };

  const deleteReply = (replyId: number) => {
    const updatedBackendReplies = backendReplies.filter(
      (backendReply) => backendReply.id !== replyId
    );
    setBackendReplies(updatedBackendReplies);
  };

  const updateReply = (text: string, replyId: number) => {
    const updatedBackendReplies = backendReplies.map((backendReply) => {
      if (backendReply.id === replyId) {
        return { ...backendReply, content: text };
      }
      return backendReply;
    });

    setBackendReplies(updatedBackendReplies);
    props.setActiveComment(null);
  };

  return (
    <div className={styles["comment-container"]}>
      <div className={styles.comment}>
        <div className={styles["comment-heading"]}>
          <img
            className={styles["user-avatar"]}
            src={props.user.image.png}
            alt="user avatar"
          />
          <p className={styles.username}>{props.user.username}</p>
          {props.user.username === props.currentUser.username && (
            <p className={styles.tag}>you</p>
          )}
          <p className={styles.date}>{props.createdAt}</p>
        </div>
        <div className={styles.editing}>
          {!isEditing && (
            <p className={styles["comment-content"]}>{props.content}</p>
          )}
          {isEditing && (
            <NewComment
              currentUser={props.currentUser}
              handleSubmit={handleUpdate}
              initialText={props.content}
              isEdit
              buttonText="update"
            />
          )}
        </div>
        <div className={styles["comment-votes"]}>
          <button
            className={styles["plus-btn"]}
            onClick={() => handleScoreChange("increase")}>
            <AddIcon />
          </button>
          <p className={styles["comment-votes_total"]}>{score}</p>
          <button
            className={styles["minus-btn"]}
            onClick={() => handleScoreChange("decrease")}>
            <RemoveIcon />
          </button>
        </div>
        <div className={styles["comment-footer"]}>
          {isCurrentUser ? (
            <div className={styles["toggled-btns"]}>
              <button
                className={styles["delete-btn"]}
                onClick={() => {
                  setShowDeleteModal(true);
                }}>
                <DeleteIcon className={styles["delete-icon"]} />
                Delete
              </button>
              <button
                className={styles["edit-btn"]}
                onClick={() => {
                  props.setActiveComment({ id: props.id, type: "editing" });
                }}>
                <EditIcon className={styles["edit-icon"]} />
                Edit
              </button>
            </div>
          ) : (
            <button
              className={styles["reply-btn"]}
              onClick={() =>
                props.setActiveComment({ id: props.id, type: "replying" })
              }>
              <ReplyIcon/> Reply
            </button>
          )}
        </div>
      </div>
      {isReplying && (
        <div>
          <NewComment
            currentUser={props.currentUser}
            placeholder={`Replying to @${props.user.username}`}
            handleSubmit={(text) =>
              addReply(`@${props.user.username}, ${text}`)
            }
            buttonText="reply"
          />
        </div>
      )}
      {props.replies && (
        <div className={styles["replies-container"]}>
          {backendReplies.map((reply) => (
            <div key={reply.id} className={styles.reply}>
              <Reply
                currentUser={props.currentUser}
                activeComment={props.activeComment}
                setActiveComment={props.setActiveComment}
                addReply={addReply}
                deleteReply={deleteReply}
                updateReply={updateReply}
                {...reply}
              />
            </div>
          ))}
        </div>
      )}
      {showDeleteModal && (
        <div className={styles["delete-modal-container"]}>
          <div className={styles["delete-modal"]}>
            <h2 className={styles["delete-modal_title"]}>Delete comment</h2>
            <p className={styles["delete-modal_content"]}>
              Are you sure you want to delete this comment? This will remove the
              comment and can't be undone.
            </p>
            <div className={styles["delete-modal_btns"]}>
              <button
                className={`${styles["delete-modal_btn"]} ${styles.no}`}
                onClick={() => {
                  setShowDeleteModal(false);
                }}>
                No, cancel
              </button>
              <button
                className={`${styles["delete-modal_btn"]} ${styles.yes}`}
                onClick={handleDelete}>
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
