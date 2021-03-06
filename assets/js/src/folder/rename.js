class FolderRename {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
  }

  rename() {
    message.open('loading', {autohide: false});
    this.ajax();
  }

  ajax() {
    let path = this.root + '/api/folder/rename';
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
          staircase.rename(results.old_id, results.new_name);
          message.open();

          let dirname = staircase.dirname(results.old_id);
          let join = staircase.join(dirname, results.new_name);

          buffer_id = join;

          staircase.refresh(join);
        }
      }
    });
  }
}