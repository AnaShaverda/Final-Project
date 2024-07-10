export interface User {
  image: {
    png: string;
    webp: string;
  };
  username: string;
}

export interface Reply {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  replyingTo: string;
  user: User;
}

export interface CommentType {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: User;
  replies: Reply[];
}

export interface Data {
  currentUser: User;
  comments: CommentType[];
}
