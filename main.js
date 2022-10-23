const obsidian = require('obsidian');

const VIEW_TYPE = 'awlc-gallery-view';

class GalleryView extends obsidian.ItemView {
  constructor(leaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE;
  }

  getDisplayText() {
    return 'Gallery';
  }

  getIcon() {
    return 'image-file';
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();

    const vaultFiles = this.app.vault.getFiles();
    const imageFiles = vaultFiles
      .filter((vaultFile) =>
        vaultFile.extension === 'png' ||
        vaultFile.extension === 'jpeg' ||
        vaultFile.extension === 'jpg'
      )
      .sort((a, b) =>
        // Sort so newer files appear at the top
        a.stat.mtime > b.stat.mtime ? -1 : 1
      );

    for (const image of imageFiles) {
      const imageEl = container.createEl(
        'img', {
          attr: {
            src: this.app.vault.adapter.getResourcePath(image.path),
            alt: '',
            class: 'gallery-item'
          }
        }
      );

      imageEl.onClickEvent(() => {
        this.app.workspace.getUnpinnedLeaf().openFile(image);
      });
    }
  }
};

class GalleryPlugin extends obsidian.Plugin {
  async onload() {
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
      active: true
    });

    this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]);
  }
};

module.exports.__esModule = true;
module.exports.default = GalleryPlugin;
