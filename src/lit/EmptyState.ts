import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("empty-state")
export class EmptyState extends LitElement {
  @property({ type: String }) title = "";
  @property({ type: String }) text = "";

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 32px 24px;
      background-color: #f8fafc;
      border-radius: 12px;
      width: 100%;
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .title {
      font-size: 1.25rem;
      color: #333;
      margin: 0;
    }

    .text {
      font-size: 1rem;
      color: #666;
      line-height: 1.5;
      margin: 0;
    }
  `;

  render() {
    return html`
      <h3 class="title">${this.title}</h3>
      <p class="text">${this.text}</p>
    `;
  }
}
