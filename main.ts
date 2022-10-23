import { readFile } from 'fs';
import { ItemView, Plugin, TFile, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE = "awlc-gallery-view";

export class GalleryView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
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

    const vaultFiles: TFile[] = this.app.vault.getFiles();
    const imageFiles = vaultFiles.filter(vaultFile =>
      vaultFile.extension === 'png' || vaultFile.extension === 'jpeg' || vaultFile.extension === 'jpg'
    );

    for (const image of imageFiles) {
      const imagePath = this.app.vault.adapter.getResourcePath(image.path)

      const link = container.createEl("a", { text: image.path, attr: { href: image.path }});
      container.createEl("img", { attr: { src: imagePath }, parent: link });
    }

    container.createEl("pre", { text: vaultFiles.toString() });
    container.createEl("p", { text: "after the pre" });
  }
}

export default class MyPlugin extends Plugin {
	async onload() {
    // see https://marcus.se.net/obsidian-plugin-docs/user-interface/views
    this.registerView(VIEW_TYPE, (leaf) => new GalleryView(leaf));

		this.addRibbonIcon('image-file', 'Open gallery', () => {
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
      active: true,
    });

    this.app.workspace.revealLeaf(
      this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
    );
  }
}
