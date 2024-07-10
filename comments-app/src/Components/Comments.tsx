import React, { useState } from "react";
import Comment from "./Comment";
import NewComment from "./NewComment";
import data from "../data/data";
import { CommentType, Data, User } from "../types";

interface CommentsProps {
  currentUser: User;
}

function Comments({ currentUser }: CommentsProps) {
  const allData: Data = data;
  const [backendComments, setBackendComments] = useState<CommentType[]>(
    allData.comments
  );
  const [activeComment, setActiveComment] = useState<{
    id: number;
    type: string;
  } | null>(null);

  const createComment = async (text: string): Promise<CommentType> => {
    return {
      content: text,
      createdAt: "Just now",
      id: Date.now(),
      replies: [],
      score: 1,
      user: currentUser,
    };
  };

  const addComment = (text: string): void => {
    createComment(text).then((comment) => {
      setBackendComments([...backendComments, comment]);
    });
  };

  const deleteComment = (commentId: number): void => {
    let updatedBackendComments = [...backendComments];

    for (let i = 0; i < updatedBackendComments.length; i++) {
      if (updatedBackendComments[i].id === commentId) {
        updatedBackendComments = updatedBackendComments.filter(
          (comment) => comment.id !== commentId
        );
        break;
      } else if (updatedBackendComments[i].replies) {
        const updatedReplies = updatedBackendComments[i].replies.filter(
          (reply) => reply.id !== commentId
        );

        if (
          updatedReplies.length !== updatedBackendComments[i].replies.length
        ) {
          updatedBackendComments[i] = {
            ...updatedBackendComments[i],
            replies: updatedReplies,
          };
          break;
        }
      }
    }

    setBackendComments(updatedBackendComments);
  };

  const updateComment = (text: string, commentId: number): void => {
    const updatedBackendComments = backendComments.map((backendComment) => {
      if (backendComment.id === commentId) {
        return { ...backendComment, content: text };
      }
      return backendComment;
    });
    setBackendComments(updatedBackendComments);
    setActiveComment(null);
  };

  return (
    <main>
      {backendComments.map((comment) => (
        <Comment
          key={comment.id}
          currentUser={currentUser}
          activeComment={activeComment}
          setActiveComment={setActiveComment}
          deleteComment={deleteComment}
          updateComment={updateComment}
          {...comment}
        />
      ))}
      <NewComment
        currentUser={currentUser}
        handleSubmit={addComment}
        initialText=""
        buttonText="send"
      />
    </main>
  );
}

export default Comments;
