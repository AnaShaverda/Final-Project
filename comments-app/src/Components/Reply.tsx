import React, { useState } from "react";
import NewComment from "./NewComment";
import ReplyIcon from "@mui/icons-material/Reply";
import styles from "./Comment.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface User {
  username: string;
  image: {
    png: string;
    webp: string;
  };
}

interface ReplyProps {
  user: User;
  currentUser: User;
  createdAt: string;
  content: string;
  score: number;
  id: number;
  activeComment: { id: number; type: string } | null;
  setActiveComment: (
    activeComment: { id: number; type: string } | null
  ) => void;
  deleteReply: (replyId: number) => void;
  updateReply: (text: string, replyId: number) => void;
  addReply: (text: string) => void;
}

const Reply: React.FC<ReplyProps> = (props) => {
  const [score, setScore] = useState<number>(props.score);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [userVote, setUserVote] = useState<'increase' | 'decrease' | null>(null);

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

  return (
    <div>
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
              handleSubmit={(text) => {
                props.updateReply(text, props.id);
              }}
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
                <DeleteIcon />
                Delete
              </button>
              <button
                className={styles["edit-btn"]}
                onClick={() => {
                  props.setActiveComment({ id: props.id, type: "editing" });
                }}>
                <EditIcon />
                Edit
              </button>
            </div>
          ) : (
            <button
              className={styles["reply-btn"]}
              onClick={() =>
                props.setActiveComment({ id: props.id, type: "replying" })
              }>
              <ReplyIcon />
              Reply
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
              props.addReply(`@${props.user.username}, ${text}`)
            }
            buttonText="reply"
          />
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
                onClick={() => {
                  props.deleteReply(props.id);
                }}>
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reply;
