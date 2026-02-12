import { useQuery } from "@tanstack/react-query";
import { getGroceryLists } from "../services/apiGroceryList";
import LoadingSpinner from "../ui/LoadingSpinner";
import Error from "../ui/Error";
import styled from "styled-components";
import GroceryListCard from "../ui/GroceryListCards";
import CreateGroceryList from "./CreateGroceryList";
// import EmptyState from "./EmptyState/EmptyState";
import "../lit/EmptyState";
import EmptyState from "./EmptyState/EmptyState";

export const GroceryLists = () => {
  const {
    isPending,
    data: groceryLists,
    error,
  } = useQuery({
    queryKey: ["groceryLists"],
    queryFn: getGroceryLists,
  });

  if (isPending) return <LoadingSpinner />;
  if (error) return <Error message={error.message} />;

  return (
    <>
      <ButtonContainer>
        <CreateGroceryList />
      </ButtonContainer>
      {/* {groceryLists && groceryLists.length > 0 ? <GroceryListCard groceryLists={groceryLists} /> : <EmptyState title="No Grocery Lists Yet" text="Create your first grocery list above to get started with organizing your groceries." />} */}
      {groceryLists && groceryLists.length > 0 ? <GroceryListCard groceryLists={groceryLists} /> : <EmptyState title="No Grocery Lists Yet" text="Create your first grocery list above to get started with organizing your groceries."></EmptyState>}
    </>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
