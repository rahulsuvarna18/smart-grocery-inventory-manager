import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useForm, SubmitHandler } from "react-hook-form";
import useAddGroceryItem from "../services/Mutations/useAddGroceryItem";
import useUpdateGroceryItemDescription from "../services/Mutations/useUpdateGroceryItemDescription";
import useSearchGroceryItems from "../services/Mutations/useSearchGroceryItems";
import { X } from "lucide-react";

const InputContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 24px 0;
  position: relative;
`;

const Form = styled.form`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const StyledInput = styled.input<{ $isExpanded?: boolean }>`
  flex: 1;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: ${(props) => (props.$isExpanded ? "#ffffff" : "#f8f9fa")};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4caf50;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const AddButton = styled.button`
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: #43a047;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #a8e0ab;
    cursor: not-allowed;
    transform: none;
  }
`;

const ExpandedModal = styled.div<{ $isExpanded: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  opacity: ${(props) => (props.$isExpanded ? 1 : 0)};
  top: ${(props) => (props.$isExpanded ? "-10px" : "0")};
  pointer-events: ${(props) => (props.$isExpanded ? "all" : "none")};
  z-index: 10;
  outline: none;
  tabindex: -1;
`;

const ModalContent = styled.div`
  padding: 16px;
  space-y: 16px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
`;

const SearchIcon = styled.span`
  color: #6b7280;
`;

const SuggestionsContainer = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
  margin-top: 16px;
`;

const SuggestionButton = styled.button<{ $isSelected?: boolean }>`
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  background: ${(props) => (props.$isSelected ? "#f3f4f6" : "transparent")};
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    color: #ef4444;
  }
`;

const DetailBox = styled.button<{ $isSelected: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${(props) => (props.$isSelected ? "#4caf50" : "#e0e0e0")};
  background-color: ${(props) => (props.$isSelected ? "#f0fdf4" : "white")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 4px;
  font-size: 14px;

  &:hover {
    border-color: #4caf50;
    background-color: #f0fdf4;
  }
`;

const DetailsContainer = styled.div`
  padding: 16px;
`;

const DetailBoxesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const DetailsHeader = styled.div`
  margin-bottom: 16px;
  text-align: center;
`;

const ItemTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const ItemSubtitle = styled.p`
  margin: 8px 0 0;
  color: #666;
  font-size: 14px;
`;

// Add a new styled component for the description input
const DescriptionInput = styled(StyledInput)`
  margin-top: 16px;
  width: 100%;
`;

// Define the form structure
interface FormValues {
  newItem: string;
}

interface InputProps {
  selectedListId: number;
}

interface SelectedItem {
  id: number;
  name: string;
  item_details: string[];
  createdItemId?: number;
  isCustom: boolean;
}

const Input: React.FC<InputProps> = ({ selectedListId }) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>();
  const { addGroceryItem, isAdding } = useAddGroceryItem();
  // const { updateDescription, isUpdating } = useUpdateGroceryItemDescription();
  const { updateDescription } = useUpdateGroceryItemDescription();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedDetails, setSelectedDetails] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState<SelectedItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const query = watch("newItem", "");
  const { searchResults, isSearching } = useSearchGroceryItems(query);

  // Add new state for description input
  const [descriptionInput, setDescriptionInput] = useState("");
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleExpand = () => {
    setIsExpanded(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Reset selected index when search results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  useEffect(() => {
    if (isExpanded && modalRef.current) {
      const modalInput = modalRef.current.querySelector("input");
      if (modalInput) {
        modalInput.focus();
      }
    }
  }, [isExpanded]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  // Add keyboard event handler at document level
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isExpanded) return;

      switch (event.key) {
        case "Escape":
          event.preventDefault();
          handleClose();
          break;
      }
    };

    if (isExpanded) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  // Focus description input when showing custom item details
  useEffect(() => {
    if (currentItem?.isCustom && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
  }, [currentItem]);

  const handleClose = () => {
    setIsExpanded(false);
    setSelectedIndex(0);
    setCurrentItem(null);
    setSelectedDetails([]);
    reset();
    setValue("newItem", "");
  };

  const handleDetailClick = (detail: string) => {
    if (!currentItem?.createdItemId) return;

    // Check if the detail is already selected
    const isSelected = selectedDetails.includes(detail);
    if (isSelected) {
      return; // If already selected, do nothing
    }

    // Add the detail to the selected details state
    setSelectedDetails((prev) => [...prev, detail]);

    // Update the description of the existing item
    updateDescription({
      itemId: currentItem.createdItemId,
      description: detail,
      groceryListId: selectedListId,
    });
  };

  const handleDescriptionSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentItem?.createdItemId && descriptionInput.trim()) {
      e.preventDefault();

      // Update the description
      updateDescription({
        itemId: currentItem.createdItemId,
        description: descriptionInput.trim(),
        groceryListId: selectedListId,
      });

      // Close the modal
      handleClose();
    }
  };

  const handleAddItem = (itemName: string) => {
    const capitalizedItem = capitalizeFirstLetter(itemName.trim());
    const matchingItem = searchResults?.find((item) => item.name.toLowerCase() === capitalizedItem.toLowerCase());

    if (matchingItem) {
      // Add existing item logic...
      addGroceryItem(
        {
          groceryListId: selectedListId,
          groceryItemId: matchingItem.id,
          name: undefined,
          isCustom: false,
          is_bought: false,
        },
        {
          onSuccess: (newItem) => {
            setCurrentItem({
              id: matchingItem.id,
              name: matchingItem.name,
              item_details: matchingItem.item_details || [],
              createdItemId: newItem.id,
              isCustom: false, // Add this field
            });
            setSelectedDetails([]);
            setValue("newItem", "");
          },
        }
      );
    } else {
      // Custom item logic
      addGroceryItem(
        {
          groceryListId: selectedListId,
          name: capitalizedItem,
          isCustom: true,
          is_bought: false,
        },
        {
          onSuccess: (newItem) => {
            // Show description input for custom items
            setCurrentItem({
              id: newItem.id,
              name: capitalizedItem,
              item_details: [],
              createdItemId: newItem.id,
              isCustom: true, // Add this field
            });
            setDescriptionInput("");
            setValue("newItem", "");
          },
        }
      );
    }
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (!data.newItem.trim()) return;

    if (searchResults && searchResults.length > 0) {
      // If there are search results, use the selected item
      const selectedItem = searchResults[selectedIndex];
      handleAddItem(selectedItem.name);
    } else {
      // If no search results, use the input value
      handleAddItem(data.newItem);
    }
  };

  // Handle UI-specific keyboard events
  const handleUIKeyDown = (event: React.KeyboardEvent) => {
    if (!isExpanded) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!currentItem && searchResults && searchResults.length > 0) {
          setSelectedIndex((prev) => (prev + 1) % searchResults.length);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!currentItem && searchResults && searchResults.length > 0) {
          setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
        }
        break;
      case "Enter":
        event.preventDefault();
        if (!currentItem) {
          handleSubmit(onSubmit)();
        }
        break;
    }
  };

  // Update the modal content rendering
  const renderModalContent = () => {
    if (!currentItem) {
      return (
        <>
          <SearchContainer>
            <SearchIcon>🔍</SearchIcon>
            <StyledInput {...register("newItem")} placeholder="Add an item to your list..." onKeyDown={handleUIKeyDown} $isExpanded={true} />
          </SearchContainer>

          <SuggestionsContainer>
            {query ? (
              <>
                <h3>Available Items</h3>
                {isSearching ? (
                  <div style={{ textAlign: "center", color: "#6b7280" }}>Searching...</div>
                ) : searchResults && searchResults.length > 0 ? (
                  searchResults.map((item, index) => (
                    <SuggestionButton
                      key={item.id}
                      onClick={() => {
                        setValue("newItem", item.name);
                        handleAddItem(item.name);
                      }}
                      $isSelected={index === selectedIndex}
                    >
                      {item.name}
                    </SuggestionButton>
                  ))
                ) : (
                  <SuggestionButton
                    onClick={() => {
                      setValue("newItem", query);
                      handleAddItem(query);
                    }}
                  >
                    {query}
                  </SuggestionButton>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", color: "#6b7280" }}>Start typing to see available items</div>
            )}
          </SuggestionsContainer>
        </>
      );
    }

    return (
      <DetailsContainer>
        <DetailsHeader>
          <ItemTitle>{currentItem.name}</ItemTitle>
          <ItemSubtitle>{currentItem.isCustom ? "Add a description for your item" : "Select item details to add to your list"}</ItemSubtitle>
        </DetailsHeader>

        {currentItem.isCustom ? (
          <DescriptionInput ref={descriptionInputRef} value={descriptionInput} onChange={(e) => setDescriptionInput(e.target.value)} onKeyDown={handleDescriptionSubmit} placeholder="Type a description and press Enter..." $isExpanded={true} />
        ) : (
          <DetailBoxesContainer>
            {currentItem.item_details.map((detail) => (
              <DetailBox key={detail} onClick={() => handleDetailClick(detail)} $isSelected={selectedDetails.includes(detail)} onKeyDown={handleUIKeyDown} tabIndex={0}>
                {detail}
              </DetailBox>
            ))}
          </DetailBoxesContainer>
        )}
      </DetailsContainer>
    );
  };

  return (
    <InputContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <StyledInput {...register("newItem", { required: "Please enter a grocery item." })} ref={inputRef} type="text" placeholder="Add an item to your list..." onClick={handleExpand} onKeyDown={handleUIKeyDown} $isExpanded={isExpanded} />
        <AddButton type="submit" disabled={isAdding}>
          {isAdding ? "Adding..." : "Add Item"}
        </AddButton>
      </Form>

      <ExpandedModal ref={modalRef} $isExpanded={isExpanded} tabIndex={-1}>
        <ModalContent>
          <CloseButton onClick={handleClose}>
            <X size={18} />
          </CloseButton>
          {renderModalContent()}
        </ModalContent>
      </ExpandedModal>
    </InputContainer>
  );
};

export default Input;
