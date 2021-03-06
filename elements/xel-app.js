
// @copyright
//   © 2016-2017 Jarosław Foksa

import {parseColor} from "../utils/color.js";
import {html} from "../utils/element.js";
import {capitalize} from "../utils/string.js";
import {sleep} from "../utils/time.js";
import {readFile} from "../utils/file.js";
import {getThemePath, getThemeName} from "../utils/theme.js";

let colorSchemesByTheme = {
  material: {},
  macos: {
    blue: "hsl(211, 96.7%, 52.9%)",
    green: "hsl(88, 35%, 46%)",
    red: "hsl(344, 65%, 45%)",
    purple: "hsl(290, 40%, 46%)",
    yellowgreen: "hsl(61, 28%, 45%)"
  },
  vanilla: {
    blue: "hsl(211, 86%, 57%)",
    green: "hsl(88, 35%, 46%)",
    red: "hsl(344, 65%, 45%)",
    purple: "hsl(290, 40%, 46%)",
    yellowgreen: "hsl(61, 28%, 45%)"
  },
};

let shadowTemplate = html`
  <template>
    <link rel="stylesheet" href="${getThemePath()}">

    <style>
      :host {
        width: 100%;
        height: 100%;
        display: block;
      }

      #main {
        position: relative;
        display: flex;
        flex-flow: row;
        width: 100%;
        height: 100%;
      }

      /**
       * Navigation
       */

      #sidebar {
        position: relative;
        width: 270px;
        overflow: auto;
        box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2),
                    0px 1px 1px 0px rgba(0,0,0,0.14),
                    0px 1px 3px 0px rgba(0,0,0,0.12);
        z-index: 100;
      }

      #sidebar #header {
        padding: 20px 0;
      }

      #sidebar #header + hr {
        margin-top: -1px;
      }

      #sidebar h1 {
        margin: 0px 22px 0px 104px;
        line-height: 1;
      }

      #sidebar #nav {
        margin-bottom: 20px;
        width: 100%;
      }

      #sidebar #nav .external-link-icon {
        margin: 0;
        width: 20px;
        height: 20px;
      }

      #sidebar #nav x-button {
        width: calc(100% + 60px);
        margin-left: -30px;
        padding: 8px 30px;
        --ripple-background: white;
      }

      #sidebar #nav x-button x-label {
        font-size: 15px;
      }

      #hide-sidebar-button {
        position: absolute;
        top: 18px;
        left: 11px;
        padding: 0;
        width: 32px;
        height: 32px;
        min-height: 32px;
      }

      #show-sidebar-button {
        position: absolute;
        top: 20px;
        left: 11px;
        z-index: 10;
        padding: 0;
        width: 32px;
        height: 32px;
        min-height: 32px;
      }

      #theme-section {
        padding: 10px 0px;
      }

      #theme-section #theme-heading {
        margin-top: 0;
      }

      #theme-section x-select {
        width: 100%;
      }

      #theme-section #theme-select {
        margin-bottom: 14px;
      }

      /**
       * Views
       */

      #views {
        display: block;
        width: 100%;
        height: 100%;
        min-width: 20px;
        min-height: 20px;
        position: relative;
        flex: 1;
      }

      #views > .view {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: auto;
      }
      #views > .view:not([selected]) {
        display: none !important;
      }

      #views > .view > article {
        padding: 0 70px;
        margin: 0 auto;
        max-width: 780px;
        box-sizing: border-box;
      }

      #views section {
        margin-bottom: 35px;
      }

      #views section[hidden] + hr,
      #views section[data-last-visible] + hr {
        display: none;
      }

      #views section h3,
      #views section h4,
      #views section h5 {
        position: relative;
      }

      /* "About" view */

      #views #about-view {
        color: white;
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        padding: 0 100px;
        margin: 0;
        max-width: none;
        box-sizing: border-box;
      }

      #about-view h1 {
        font-size: 170px;
        font-weight: 700;
        line-height: 1.5;
        margin: 0 0 50px 0;
        padding: 0;
        line-height: 1;
      }
      @media screen and (max-width: 880px) {
        #about-view h1  {
          font-size: 120px;
        }
      }

      #about-view h2 {
        font-size: 27px;
        font-weight: 400;
        line-height: 1.05;
        color: rgba(255,255,255, 0.8);
        margin: 0 0 20px 0;
        text-transform: none;
      }

      #about-view h2 em {
        color: rgba(255,255,255, 0.95);
        font-style: normal;
        font-weight: 700;
      }

      /* "Setup" view */

      #views #setup-view h3 {
        margin-bottom: 0;
      }

      #views #setup-view h3 x-icon {
        width: 40px;
        height: auto;
        display: inline-block;
        vertical-align: middle;
      }

      #views #setup-view pre {
        display: block;
        white-space: pre;
        overflow: auto;
      }

      #views #setup-view dd {
        margin: 0 0 18px 0;
      }
      #views #setup-view dd:last-of-type {
        margin: 0;
      }

      /* "FAQ" view */

      #views #faq-view h4 {
        margin-top: 0;
      }

      /* "Resources" view */

      #views #resources-view ul {
        margin-bottom: 0;
        padding-left: 20px;
      }
    </style>

    <main id="main">
      <x-button id="show-sidebar-button" icon="menu" skin="textured">
        <x-icon name="menu"></x-icon>
      </x-button>

      <sidebar id="sidebar">
        <header id="header">
          <h1 id="logo">Xel</h1>

          <x-button id="hide-sidebar-button" skin="textured">
            <x-icon name="chevron-left"></x-icon>
          </x-button>
        </header>

        <hr/>

        <nav id="nav">
          <section>
            <a href="/">
              <x-button skin="nav">
                <x-icon name="info"></x-icon>
                <x-label>About</x-label>
              </x-button>
            </a>

            <a href="/setup">
              <x-button skin="nav">
                <x-icon name="build"></x-icon>
                <x-label>Setup</x-label>
              </x-button>
            </a>

            <a href="/faq">
              <x-button skin="nav">
                <x-icon name="question-answer"></x-icon>
                <x-label>FAQ</x-label>
              </x-button>
            </a>

            <a href="/resources">
              <x-button skin="nav">
                <x-icon name="book"></x-icon>
                <x-label>Resources</x-label>
              </x-button>
            </a>
          </section>

          <hr/>

          <section>
            <a href="https://github.com/jarek-foksa/xel" target="_blank">
              <x-button skin="nav">
                <x-icon name="code"></x-icon>
                <x-label>Source Code</x-label>
                <x-icon class="external-link-icon" name="exit-to-app"></x-icon>
              </x-button>
            </a>

            <a href="https://github.com/jarek-foksa/xel/issues" target="_blank">
              <x-button skin="nav">
                <x-icon name="bug-report"></x-icon>
                <x-label>Bugs</x-label>
                <x-icon class="external-link-icon" name="exit-to-app"></x-icon>
              </x-button>
            </a>

            <a href="https://github.com/jarek-foksa/xel/commits" target="_blank">
              <x-button skin="nav">
                <x-icon name="event"></x-icon>
                <x-label>Changelog</x-label>
                <x-icon class="external-link-icon" name="exit-to-app"></x-icon>
              </x-button>
            </a>
          </section>

          <hr/>

          <section id="theme-section">
            <div id="theme-subsection">
              <h3 id="theme-heading">Theme</h3>

              <x-select id="theme-select">
                <x-menu>
                  <x-menuitem value="macos">
                    <x-label>MacOS</x-label>
                  </x-menuitem>

                  <x-menuitem value="material" toggled>
                    <x-label>Material</x-label>
                  </x-menuitem>

                  <x-menuitem value="vanilla">
                    <x-label>Vanilla</x-label>
                  </x-menuitem>
                </x-menu>
              </x-select>
            </div>

            <div id="accent-color-subsection">
              <h3>Accent color</h3>

              <x-select id="accent-color-select">
                <x-menu id="accent-color-menu"></x-menu>
              </x-select>
            </div>
          </section>

          <hr/>

          <section>
            <h3>Primitives</h3>

            <a href="/elements/x-box">
              <x-button skin="nav">
                <x-label>x-box</x-label>
              </x-button>
            </a>

            <a href="/elements/x-card">
              <x-button skin="nav">
                <x-label>x-card</x-label>
              </x-button>
            </a>

            <a href="/elements/x-accordion">
              <x-button skin="nav">
                <x-label>x-accordion</x-label>
              </x-button>
            </a>

            <a href="/elements/x-icon">
              <x-button skin="nav">
                <x-label>x-icon</x-label>
              </x-button>
            </a>

            <a href="/elements/x-label">
              <x-button skin="nav">
                <x-label>x-label</x-label>
              </x-button>
            </a>

            <a href="/elements/x-shortcut">
              <x-button skin="nav">
                <x-label>x-shortcut</x-label>
              </x-button>
            </a>

            <a href="/elements/x-stepper">
              <x-button skin="nav">
                <x-label>x-stepper</x-label>
              </x-button>
            </a>

            <a href="/elements/x-swatch">
              <x-button skin="nav">
                <x-label>x-swatch</x-label>
              </x-button>
            </a>
          </section>

          <hr/>

          <section>
            <h3>Buttons</h3>

            <a href="/elements/x-button">
              <x-button skin="nav">
                <x-label>x-button</x-label>
              </x-button>
            </a>

            <a href="/elements/x-buttons">
              <x-button skin="nav">
                <x-label>x-buttons</x-label>
              </x-button>
            </a>
          </section>

          <hr/>

          <section>
            <h3>Tabs</h3>

            <a href="/elements/x-tabs">
              <x-button skin="nav">
                <x-label>x-tabs</x-label>
              </x-button>
            </a>

            <a href="/elements/x-doctabs">
              <x-button skin="nav">
                <x-label>x-doctabs</x-label>
              </x-button>
            </a>
          </section>

          <hr/>

          <section>
            <h3>Menus</h3>

            <a href="/elements/x-menu">
              <x-button skin="nav">
                <x-label>x-menu</x-label>
              </x-button>
            </a>

            <a href="/elements/x-menuitem">
              <x-button skin="nav">
                <x-label>x-menuitem</x-label>
              </x-button>
            </a>

            <a href="/elements/x-menubar">
              <x-button skin="nav">
                <x-label>x-menubar</x-label>
              </x-button>
            </a>

            <a href="/elements/x-contextmenu">
              <x-button skin="nav">
                <x-label>x-contextmenu</x-label>
              </x-button>
            </a>
          </section>

          <hr/>

          <section>
            <h3>Popups</h3>

            <a href="/elements/dialog">
              <x-button skin="nav">
                <x-label>dialog</x-label>
              </x-button>
            </a>

            <a href="/elements/x-popover">
              <x-button skin="nav">
                <x-label>x-popover</x-label>
              </x-button>
            </a>

            <a href="/elements/x-notification">
              <x-button skin="nav">
                <x-label>x-notification</x-label>
              </x-button>
            </a>
          </section>

          <hr/>

          <section>
            <h3>Forms</h3>

            <a href="/elements/x-checkbox">
              <x-button skin="nav">
                <x-label>x-checkbox</x-label>
              </x-button>
            </a>

            <a href="/elements/x-radio">
              <x-button skin="nav">
                <x-label>x-radio</x-label>
              </x-button>
            </a>

            <a href="/elements/x-switch">
              <x-button skin="nav">
                <x-label>x-switch</x-label>
              </x-button>
            </a>

            <a href="/elements/x-select">
              <x-button skin="nav">
                <x-label>x-select</x-label>
              </x-button>
            </a>

            <a href="/elements/x-colorselect">
              <x-button skin="nav">
                <x-label>x-colorselect</x-label>
              </x-button>
            </a>

            <a href="/elements/x-dateselect">
              <x-button skin="nav">
                <x-label>x-dateselect</x-label>
              </x-button>
            </a>

            <a href="/elements/x-input">
              <x-button skin="nav">
                <x-label>x-input</x-label>
              </x-button>
            </a>

            <a href="/elements/x-numberinput">
              <x-button skin="nav">
                <x-label>x-numberinput</x-label>
              </x-button>
            </a>

            <a href="/elements/x-taginput">
              <x-button skin="nav">
                <x-label>x-taginput</x-label>
              </x-button>
            </a>

            <a href="/elements/x-textarea">
              <x-button skin="nav">
                <x-label>x-textarea</x-label>
              </x-button>
            </a>

            <a href="/elements/x-slider">
              <x-button skin="nav">
                <x-label>x-slider</x-label>
              </x-button>
            </a>
          </section>

          <hr/>

          <section>
            <h3>Progress</h3>

            <a href="/elements/x-progressbar">
              <x-button skin="nav">
                <x-label>x-progressbar</x-label>
              </x-button>
            </a>

            <a href="/elements/x-throbber">
              <x-button skin="nav">
                <x-label>x-throbber</x-label>
              </x-button>
            </a>
          </section>
        </nav>
      </sidebar>

      <div id="views"></div>
    </main>
  </template>
`;

export class XelAppElement extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({mode: "closed"});
    this._shadowRoot.append(document.importNode(shadowTemplate.content, true));

    for (let element of this._shadowRoot.querySelectorAll("[id]")) {
      this["#" + element.id] = element;
    }

    window.addEventListener("load", (event) => this._onWindowLoad(event));
    window.addEventListener("popstate", (event) => this._onPopState(event));
    window.addEventListener("beforeunload", (event) => this._onWindowUnload(event));

    this._shadowRoot.addEventListener("click", (event) => this._onShadowRootClick(event));
    this["#hide-sidebar-button"].addEventListener("click", (event) => this._onHideNavButtonClick(event));
    this["#show-sidebar-button"].addEventListener("click", (event) => this._onShowNavButtonClick(event));
    this["#theme-select"].addEventListener("change", (event) => this._onThemeSelectChange(event));
    this["#accent-color-select"].addEventListener("change", (event) => this._onAccentColorSelectChange(event));
  }

  connectedCallback() {
    history.scrollRestoration = "manual";

    if (history.state === null) {
      history.replaceState(null, null, window.location.href);
    }

    this._updateNavButtons();
    this._updateViews();
    this._updateThemeSection();

    this._applyAccentColor();
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async _onThemeSelectChange() {
    sessionStorage.setItem("theme", this["#theme-select"].value);
    await sleep(800);
    location.reload();
  }

  _onAccentColorSelectChange() {
    sessionStorage.setItem("accentColorName", this["#accent-color-select"].value);
    this._applyAccentColor();
  }

  _onWindowLoad() {
    let scrollTop = parseInt(sessionStorage.getItem("selectedViewScrollTop") || "0");
    let selectedView = this["#views"].querySelector(".view[selected]");

    if (selectedView) {
      selectedView.scrollTop = scrollTop;
    }
    else {
      sleep(100).then(() => {
        selectedView = this["#views"].querySelector(".view[selected]");
        selectedView.scrollTop = scrollTop
      });
    }
  }

  _onWindowUnload(event) {
    let selectedView = this["#views"].querySelector(".view[selected]");
    sessionStorage.setItem("selectedViewScrollTop", selectedView.scrollTop);
  }

  _onPopState(event) {
    this._updateNavButtons();
    this._updateViews();
  }

  _onShadowRootClick(event) {
    let {ctrlKey, shiftKey, metaKey, target} = event;

    if (ctrlKey === false && shiftKey === false && metaKey === false) {
      let anchor = target.closest("a");

      if (anchor) {
        let url = new URL(anchor.href);

        if (location.origin === url.origin) {
          event.preventDefault();

          if (location.pathname !== url.pathname) {
            history.pushState(null, null, anchor.href);

            this._updateNavButtons();
            this._updateViews();
          }
        }
      }
    }
  }

  _onHideNavButtonClick(event) {
    if (event.button === 0) {
      this._hideSidebar();
    }
  }

  _onShowNavButtonClick(event) {
    if (event.button === 0) {
      this._showSidebar();
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  _showSidebar() {
    return new Promise(async (resolve) => {
      this["#sidebar"].hidden = false;

      let {width, height, marginLeft} = getComputedStyle(this["#sidebar"]);
      let fromMarginLeft = (marginLeft === "0px" && width !== "auto" ? `-${width}` : marginLeft);
      let toMarginLeft = "0px";

      let animation = this["#sidebar"].animate(
        {
          marginLeft: [fromMarginLeft, toMarginLeft]
        },
        {
          duration: 250,
          easing: "cubic-bezier(0.4, 0.0, 0.2, 1)"
        }
      );

      this["#sidebar"].style.marginLeft = "0";
      this._currentAnimation = animation;
    });
  }

  _hideSidebar() {
    return new Promise(async (resolve) => {
      this["#sidebar"].hidden = false;

      let {width, height, marginLeft} = getComputedStyle(this["#sidebar"]);
      let fromMarginLeft = (marginLeft === "0px" && width !== "auto" ? "0px" : marginLeft);
      let toMarginLeft = `-${width}`;

      let animation = this["#sidebar"].animate(
        {
          marginLeft: [fromMarginLeft, toMarginLeft]
        },
        {
          duration: 250,
          easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
        }
      );

      this["#sidebar"].style.marginLeft = toMarginLeft;
      this._currentAnimation = animation;

      await animation.finished;

      if (this._currentAnimation === animation) {
        this["#sidebar"].hidden = true;
      }
    });
  }

  _applyAccentColor() {
    let accentColorName = sessionStorage.getItem("accentColorName");

    if (accentColorName !== null) {
      let themeName = getThemeName();
      let accentColor = colorSchemesByTheme[themeName][accentColorName];

      if (!accentColor) {
        let names = Object.keys(colorSchemesByTheme[themeName]);

        if (names.length > 0) {
          accentColor = colorSchemesByTheme[themeName][names[0]];
        }
      }

      if (accentColor) {
        let [h, s, l] = parseColor(accentColor, "hsla");
        document.body.style.setProperty("--accent-color-h", h);
        document.body.style.setProperty("--accent-color-s", s + "%");
        document.body.style.setProperty("--accent-color-l", l + "%");
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // @info
  //   Update selected nav button to match current location.
  _updateNavButtons() {
    for (let button of this["#nav"].querySelectorAll("x-button")) {
      let anchor = button.closest("a");

      if (anchor) {
        let url = new URL(anchor);

        if (url.origin === location.origin && url.pathname === location.pathname) {
          button.setAttribute("toggled", "");
        }
        else {
          button.removeAttribute("toggled");
        }
      }
    }
  }

  // @info
  //   Update displayed view to match current location
  async _updateViews() {
    let selectedView = this["#views"].querySelector(".view[selected]");

    if (!selectedView || selectedView.dataset.pathname !== location.pathname) {
      let view = this["#views"].querySelector(`[data-pathname="${location.pathname}"]`);

      // If the view does not exist, try to create it
      if (!view) {
        let url = "";

        if (location.pathname === "/") {
          url = "docs/about.html";
        }
        else if (location.pathname.startsWith("/elements/")) {
          url = "docs" + location.pathname.substring(9) + ".html";
        }
        else {
          url = "docs" + location.pathname + ".html";
        }

        let viewHTML = await readFile(url);
        view = html`${viewHTML}`;
        view.setAttribute("data-pathname", location.pathname);
        this["#views"].append(view);
      }

      if (location.pathname === "/") {
        document.querySelector("title").textContent = "Xel";
      }
      else {
        document.querySelector("title").textContent = "Xel - " + view.querySelector("h2").textContent;
      }

      // Toggle view
      {
        let view = this["#views"].querySelector(`[data-pathname="${location.pathname}"]`);
        let otherView = this["#views"].querySelector(`.view[selected]`);

        if (otherView) {
          if (otherView === view) {
            return;
          }
          else {
            otherView.removeAttribute("selected");
          }
        }

        view.setAttribute("selected", "");
      }

      // Hide theme-specific sections that don't match the current theme
      {
        let themeName = getThemeName();

        for (let section of view.querySelectorAll("section")) {
          if (section.hasAttribute("data-themes")) {
            if (section.getAttribute("data-themes").includes(themeName) === false) {
              section.hidden = true;
            }
          }
        }

        let visibleSections = view.querySelectorAll("section:not([hidden])");

        if (visibleSections.length > 0) {
          let lastVisibleSection = visibleSections[visibleSections.length-1];
          lastVisibleSection.setAttribute("data-last-visible", "");
        }
      }

      // Remove offscreen views
      {
        for (let view of [...this["#views"].children]) {
          if (view.hasAttribute("animating") === false && view.hasAttribute("selected") === false) {
            view.remove();
          }
        }
      }
    }
  }

  _updateThemeSection() {
    let themeName = getThemeName();

    // Update theme subsection
    {
      for (let item of this["#theme-select"].querySelectorAll("x-menuitem")) {
        if (item.getAttribute("value") === themeName) {
          item.setAttribute("toggled", "");
        }
        else {
          item.removeAttribute("toggled");
        }
      }
    }

    // Update accent color subsection
    {
      if (themeName === "material") {
        this["#accent-color-subsection"].hidden = true;
      }
      else {
        let accentColorName = sessionStorage.getItem("accentColorName");
        let supportedAccentColorNames = Object.keys(colorSchemesByTheme[themeName]);

        let itemsHTML = "";

        for (let [colorName, colorValue] of Object.entries(colorSchemesByTheme[themeName])) {
          itemsHTML += `
            <x-menuitem value="${colorName}" toggled>
              <x-swatch value="${colorValue}"></x-swatch>
              <x-label>${capitalize(colorName)}</x-label>
            </x-menuitem>
          `;
        }

        this["#accent-color-menu"].innerHTML = itemsHTML;

        if (accentColorName === null) {
          if (supportedAccentColorNames.length > 0) {
            accentColorName = supportedAccentColorNames[0];
            sessionStorage.setItem("accentColorName", accentColorName);
          }
        }

        if (supportedAccentColorNames.includes(accentColorName) === false) {
          if (supportedAccentColorNames.length > 0) {
            accentColorName = supportedAccentColorNames[0];
            sessionStorage.setItem("accentColorName", accentColorName);
          }
          else {
            accentColorName = null;
          }
        }

        for (let item of this["#accent-color-select"].querySelectorAll("x-menuitem")) {
          if (item.getAttribute("value") === accentColorName) {
            item.setAttribute("toggled", "");
          }
          else {
            item.removeAttribute("toggled");
          }
        }

        this["#accent-color-subsection"].hidden = false;
      }
    }
  }
}

customElements.define("xel-app", XelAppElement);
