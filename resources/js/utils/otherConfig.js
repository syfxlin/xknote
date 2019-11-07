const otherConfig = {
  tinymceSetting: {
    language_url: '/static/tinymce/langs/zh_CN.js',
    language: 'zh_CN',
    plugins:
      'print preview fullpage searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern',
    toolbar:
      'formatselect | fontsizeselect | bold italic underline strikethrough blockquote forecolor backcolor prismjs | link image media pageembed | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | tex-$ tex-math flow seq gantt mermaid | removeformat code toMarkdownEditor | undo redo',
    image_advtab: true,
    importcss_append: true,
    height: '100%',
    template_cdate_format: '[CDATE: %m/%d/%Y : %H:%M:%S]',
    template_mdate_format: '[MDATE: %m/%d/%Y : %H:%M:%S]',
    image_caption: true,
    spellchecker_dialog: true,
    spellchecker_whitelist: ['Ephox', 'Moxiecode']
  },
  aceSetting: {
    minLines: 10,
    mode: 'ace/mode/markdown',
    value: '# XK-Note'
  },
  xkSetting: {
    apiBaseUrl: '',
    imgUpload: '/api/images',
    graffUrl: 'static/',
    graffUpload: 'http://test.ixk.me/upload.php',
    scrollMode: 'javascript'
  }
};

export default otherConfig;
