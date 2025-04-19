import { gql } from '@apollo/client';

export const UPDATE_QUESTION = gql`
  mutation UpdateQuestion($id: uuid!, $text: String!, $explanation: String!) {
    update_questions_by_pk(
      pk_columns: { id: $id }
      _set: { text: $text, explanation: $explanation }
    ) {
      id
    }
  }
`;
