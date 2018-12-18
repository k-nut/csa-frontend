import styled from "styled-components";

export const PlainButton = styled.button`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  cursor: pointer;
  background: transparent;
`;


export const ButtonHoverContainer = styled.div`
  ${PlainButton} {
    visibility: hidden;
  }

  &:hover {
    ${PlainButton} {
      visibility: visible;
    }
  }
`;
