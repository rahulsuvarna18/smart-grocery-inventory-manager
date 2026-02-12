import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

interface RecommendationItem {
  title: string;
  emoji: string;
}

@customElement("list-recommendations")
export class ListRecommendations extends LitElement {
  // Internal reactive state
  @state() private isModalOpen = false;
  @state() private selectedTitle = "";
  @state() private isCreating = false;

  private recommendationsList: RecommendationItem[] = [
    { title: "Your Next Party", emoji: "🎉" },
    { title: "Groceries", emoji: "🥑" },
    { title: "Clothes", emoji: "👕" },
    { title: "Holiday", emoji: "🏖️" },
    { title: "Drugstore", emoji: "💊" },
  ];

  static styles = css`
    :host {
      display: block;
      margin-top: 48px;
      width: 100%;
      max-width: 1200px;
      font-family: sans-serif;
    }

    h2 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sparkle {
      color: #f59e0b;
      font-size: 24px;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      width: 100%;
    }

    button.card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      height: 140px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 1rem;
    }

    button.card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
      border-color: #4caf50;
    }

    button.card:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .card-title {
      font-weight: 600;
      color: #2c3e50;
    }

    .emoji {
      font-size: 24px;
    }

    /* Simple Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal {
      background: white;
      border-radius: 12px;
      padding: 32px;
      width: 320px;
      text-align: center;
    }

    .spinner {
      margin: 20px 0;
      font-size: 32px;
      animation: spin 1s linear infinite;
      display: inline-block;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .loading-text {
      color: #666;
      margin-top: 12px;
      font-size: 0.9rem;
    }
  `;

  private handleCardClick(title: string) {
    if (this.isCreating) return;

    this.selectedTitle = title;
    this.isModalOpen = true;
    this.isCreating = true;

    const eventPayload = {
      detail: { name: title, color: "#000000" },
      bubbles: true,
      composed: true,
    };

    setTimeout(() => {
      // Emit event to parent (React can listen to this)
      this.dispatchEvent(new CustomEvent("create-list", eventPayload));

      this.isModalOpen = false;
      this.isCreating = false;
    }, 900);
  }

  render() {
    return html`
      <h2>
        <span class="sparkle">✨</span>
        Recommended Lists
      </h2>

      <div class="cards">
        ${this.recommendationsList.map(
          (item) => html`
            <button class="card" ?disabled=${this.isCreating} @click=${() => this.handleCardClick(item.title)}>
              <div class="emoji">${item.emoji}</div>
              <div class="card-title">${item.title}</div>
            </button>
          `,
        )}
      </div>

      ${this.isModalOpen
        ? html`
            <div class="modal-backdrop">
              <div class="modal">
                <div class="spinner">⏳</div>
                <div class="loading-text">
                  Creating your ${this.selectedTitle} list...
                  <br />
                  Just a moment please!
                </div>
              </div>
            </div>
          `
        : null}
    `;
  }
}
