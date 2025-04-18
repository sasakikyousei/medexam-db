// src/lib/queries.ts

import { gql } from '@apollo/client';

export const GET_QUESTION_BY_NUMBER = gql`
  query GetQuestionByNumber($questionNumber: String!) {
    questions(where: { question_number: { _eq: $questionNumber } }) {
      id
      question_number
      year
      block
      number
      text
      correct_answers
      explanation
      department_id
    }
  }
`;
