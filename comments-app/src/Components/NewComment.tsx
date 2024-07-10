import { useState } from "react";
import styles from "./Comment.module.css";

interface User {
  username: string;
}

interface NewCommentProps {
  currentUser: User;
  handleSubmit: (text: string) => void;
  placeholder?: string;
  initialText?: string;
  isEdit?: boolean;
  buttonText: string;
}

export default function NewComment({
  currentUser,
  handleSubmit,
  placeholder = "Add comment...",
  initialText = "",
  isEdit = false,
  buttonText,
}: NewCommentProps) {
  const [message, setMessage] = useState<string>(initialText);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(message);
    setMessage("");
  };

  return (
    <form
      className={
        isEdit ? styles["edit-comment"] : styles["new-comment-container"]
      }
      onSubmit={onSubmit}>
      <textarea
        className={styles["new-comment"]}
        placeholder={placeholder}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      {!isEdit && (
        <img
          className={styles["new-comment-avatar"]}
          src={`./images/avatars/image-${currentUser.username}.png`}
          alt={currentUser.username}
        />
      )}
      <button className={styles["submit"]} type="submit">
        {buttonText}
      </button>
    </form>
  );
}
