var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => GalleryPlugin
});
module.exports = __toCommonJS(main_exports);

const obsidian = require("obsidian");

const VIEW_TYPE = "awlc-gallery-view";

class GalleryView extends obsidian.ItemView {
  constructor(leaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE;
  }

  getDisplayText() {
    return "Gallery";
  }

  getIcon() {
    return "image-file";
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();

    const vaultFiles = this.app.vault.getFiles();
    const imageFiles = vaultFiles.filter((vaultFile) => vaultFile.extension === "png" || vaultFile.extension === "jpeg" || vaultFile.extension === "jpg");

    for (const image of imageFiles) {
      const imagePath = this.app.vault.adapter.getResourcePath(image.path).split('?')[0];
      const imageEl = container.createEl("img", { attr: { src: imagePath, alt: '', class: 'gallery-item'} });

      imageEl.onClickEvent(() => {
          this.app.workspace.getUnpinnedLeaf().openFile(image);
      });
    }
  }
};

class GalleryPlugin extends obsidian.Plugin {
  async onload() {
    this.registerView(VIEW_TYPE, (leaf) => new GalleryView(leaf));
    this.addRibbonIcon("image-file", "Open gallery", () => {
      this.activateView();
    });
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }

  async activateView() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);

    await this.app.workspace.getLeaf(false).setViewState({
      type: VIEW_TYPE,
      active: true
    });

    this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]);
  }
};
