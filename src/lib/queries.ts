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
      department {
        name
      }
      question_images {
        image_url
      }
    }
  }
`;

export const GET_QUESTIONS_BY_BLOCK = gql`
  query GetQuestionsByBlock($year: Int!, $block: String!) {
    questions(
      where: { year: { _eq: $year }, block: { _eq: $block } }
      order_by: { number: asc }
    ) {
      id
      question_number
      text
      department {
        name
      }
    }
  }
`;
