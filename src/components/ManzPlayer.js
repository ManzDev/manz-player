const TYPES = {
  IFRAME: "Video de Youtube",
  VIDEO: "Archivo multimedia de video",
  AUDIO: "Archivo multimedia de audio"
};

const getDescription = (nodeName) => TYPES[nodeName];

class ManzPlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
      :host {
        --color: #d03840;
        --light-color: color-mix(in srgb, var(--color), white 70%);
        --dark-color: color-mix(in srgb, var(--color), black 10%);
        --hover-color: color-mix(in srgb, var(--color), black 25%);
        --default-font: Jost, sans-serif;
        --round-factor: 15px;
        --width: 650px;
      }

      .container {
        max-width: var(--width);
      }

      :where(header) {
        min-height: 160px;
        background-color: var(--color);
        border-radius: var(--round-factor) var(--round-factor) 0 0;
        padding: 1rem;

        display: grid;
        grid-template-columns: 175px 1fr 32px;
        gap: 1rem;
        place-items: center;

        & img {
          border-radius: var(--round-factor);
          box-shadow: -4px 6px 4px #0003;
        }

        & .data-info {
          display: grid;
          width: 100%;
          height: 100%;
          place-content: start;
          padding-top: 2rem;

          & :is(h1, p) {
            color: #fff;
            font-family: var(--default-font);
            margin: 0;
            line-height: 110%;
          }
        }

        & .icons-container {
          display: grid;
          height: 100%;
          align-content: start;

          & .manzdev {
            --size: 32px;

            width: var(--size);
            height: var(--size);
            align-self: end;
            justify-self: start;
          }
        }
      }

      .playlist {
        min-height: 150px;
        background-color: var(--dark-color);
        border-radius: 0 0 var(--round-factor) var(--round-factor);
        padding: 1rem;

        & .item {
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          display: grid;
          grid-template-columns: 35px 1fr;
          align-items: center;
          counter-increment: item 1;
          border-radius: 6px;

          & .symbol {
            display: grid;

            &::after {
              font-family: var(--default-font);
              content: counter(item);
              color: var(--light-color);
            }
          }

          &:hover {
            background-color: var(--hover-color);

            & .symbol::after {
              content: "►";
            }
          }

          & p {
            font-family: var(--default-font);
            color: var(--light-color);
            margin: 0;

            &:first-child { font-weight: bold; color: #fff }
          }
        }
      }
    `;
  }

  connectedCallback() {
    this.render();
    this.renderContent();
  }

  renderContent() {
    const dataInfo = this.shadowRoot.querySelector(".data-info");
    const h1 = this.querySelector("h1");
    const p = this.querySelector("p");
    dataInfo.append(h1, p);
    this.renderPlaylist();
  }

  renderPlaylist() {
    const playList = this.shadowRoot.querySelector(".playlist");
    this.elements = [...this.querySelectorAll("iframe, audio, video")];
    const items = this.elements.map(item => {
      const { src, title, nodeName } = item;
      const description = getDescription(nodeName);

      return /* html */`<div class="item" data-url="${src}">
        <div class="symbol"></div>
        <div class="data">
          <p>${title}</p>
          <p class="subtext">${description}</p>
        </div>
      </div>`;
    });
    playList.insertAdjacentHTML("afterbegin", items.join(""));
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${ManzPlayer.styles}</style>
    <div class="container">
      <header>
        <img src="assets/default-cover.png" alt="">
        <div class="data-info">
        </div>
        <div class="icons-container">
          <svg class="manzdev" viewBox="10 10 110 110">
            <path fill="#fff" d="m92.268 7.57-62.479 6.84.924 8.43-8.184.896.87 7.934-7.934.867 6.865 62.727 8.182-.897.842 7.688-8.182.894 5.045 48.373 86.277-9.443-10.34-94.461 7.688-.842-3.447-31.486-15.124 1.654zm-7.07 10.059.874 7.984 15.198-1.664 1.69 15.455-7.728.846v.002L79.78 41.943l-.845-7.728-30.91 3.385.845 7.726h-.002l.818 7.47-7.986.876.03.258 2.537 23.181.845 7.73 7.73-.845.028.254.818 7.473 15.711-1.719.903 8.242L85.5 96.582l-.846-7.73-7.73.847-.875-7.986 15.715-1.72 1.72 15.714 7.955-.87 4.434 38.985-70.47 7.565L31.966 110l7.984-.873-.846-7.729 7.73-.845-.817-7.471-7.73.848-.876-7.987-7.726.846-5.104-46.625 7.984-.875-.843-7.726 7.726-.846-.875-7.985zm3.689 31.137 1.748 15.97-8.242.903-1.75-15.971zm-23.461 2.568 1.748 15.97-8.242.901-1.748-15.969zm14.662 61.396-8.016.877.897 8.18-7.946.87.866 7.904 8.013-.877-.863-7.887 7.945-.87zm9.998 15.1-8.014.877h-.002l-8.12.89.82 7.495 8.12-.89h.003l8.011-.878z" />
          </svg>
        </div>
      </header>
      <div class="playlist">
      </div>
    </div>`;
  }
}

customElements.define("manz-player", ManzPlayer);
