import styled from "styled-components";
import { GroceryLists } from "../components/GroceryLists";
import ListRecommendations from "../components/ListRecommendations";
import "../lit/ListRecommendations";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
`;

const HomePage = () => {
  return (
    <Container>
      <GroceryLists />
      <ListRecommendations></ListRecommendations>
      {/* <ListRecommendations /> */}
    </Container>
  );
};

export default HomePage;
