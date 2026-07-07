export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export interface UserType {
  uid: string;
  displayName: string;
  email: string;
}

export interface FeedType {
  author: string;
  title: string;
  description: string;
  urlToImage: string;
  publishedAt: Date,
  url: string;
  content: string;
}

export interface QuestionOptionsType {
  text: string;
  value: number;
}

export interface QuestionType {
  answer: number;
  options: QuestionOptionsType[],
  question: string;
}

export type ColorAvailable = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'background' | undefined;


export type QuizType = {
  id?: string;
  userId: string;
  score: number;
  total: number;
  date: string;
  answers: {
    question: string;
    selected: string | number;
    correct: number;
    isCorrect: boolean;
  }[];
};

export type UserUpdatePayload = {
  displayName: string;
};
