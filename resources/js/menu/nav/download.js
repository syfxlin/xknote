import store from "../../store";

export default {
  downloadMarkdown: {
    name: "导出为Markdown文件",
    operate: "downloadMarkdown",
    handler() {
      window.XKEditor.download(
        store.state.note.xknoteOpened.name.replace(".md", ""),
        "markdown"
      );
    }
  },
  downloadHTML: {
    name: "导出HTML文件",
    operate: "downloadHTML",
    handler() {
      window.XKEditor.download(
        store.state.note.xknoteOpened.name.replace(".md", ""),
        "html"
      );
    }
  },
  downloadFullHTML: {
    name: "导出带样式的HTML文件",
    operate: "downloadFullHTML",
    handler() {
      window.XKEditor.download(
        store.state.note.xknoteOpened.name.replace(".md", ""),
        "fullhtml"
      );
    }
  }
};
