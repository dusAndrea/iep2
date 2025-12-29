export interface UserType {
  id: string,
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  displayName: string;
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

export type QuizAnswerType = {
  question: string;
  selected: string | number;
  correct: string | number;
  isCorrect: boolean;
};

export type QuizType = {
  id?: string;
  userId: string;
  score: number;
  date: string;
  questions: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }[];
};
