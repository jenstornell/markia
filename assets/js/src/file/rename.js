class FileRename {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
  }

  init() {
    this.events();
  }

  events() {
    this.onChange();
  }

  onChange() {
    $('.topbar .path input').addEventListener('keyup', (e) => {
      if(e.code == 'Enter') {
        e.target.blur();
        this.rename();
      }
    });
  }

  rename() {
    if(!confirm('Rename the current file?')) return;
    message.open('loading', {autohide: false});
    this.ajax();
  }

  ajax() {
    let path = this.root + '/api/file/rename';
    let data = {};
    data.id = $('[data-sc-active]').dataset.scName;
    data.filename = $('[data-path] input').value;

    message.open('loading', {autohide: false});

    fetch(path, {
      method: 'post',
      body: JSON.stringify(data),
    })
    .then((response) => {
        return response.text();
    })
    .then((text) => {
      message.open(false, text);

      let results = JSON.parse(text);

      if(!isJson(text)) {
        message.open(false, text);
      } else {
        if(!results.success) {
          message.open(false, results.message);
        } else {
          staircase.rename(results.old_id, results.new_filename, 'file');
          staircase.rename(results.old_revision, results.new_filename, 'folder');
          message.open();
        }
      }
    });
  }
}