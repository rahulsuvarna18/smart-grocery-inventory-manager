import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { customElement, state } from "react-hook-form";
import { navigator } from "lit-element-router";

interface GroceryListCardProps {
  groceryLists: {
    id: number;
    created_at: string;
    grocery_list_name: string;
    user_id: string;
    color: string;
  };
}

interface SelectedList {
  id: number;
  name: string;
  color: string;
}

@customElement("grocery-list-cards")
export class GroceryListCards extends LitElement {
  @property({ type: Array })
  groceryListCardProps: GroceryListCardProps[] = [];
  @state() private deleteList = false;
  @state() private updateList = false;
  @state() private modalOpen = false;
  @state() private selectedListId: number | null = null;
  @state() private selectedList: SelectedList | null = null;
  @state() private editName = "";
  @state() private selectedColor = "";
  @state() private shareModalOpen = false;
  @state() private email = "";

  private handleDelete(e: Event, id: number) {
    e.stopPropagation();
    this.selectedListId = id;
    this.modalOpen = true;
  }

  private confirmDelete() {
    if (this.selectedListId) {
      this.deleteList = this.selectedListId;
      this.modalOpen = false;
    }
  }
}
