var Application = {

  Init : function() {
    this.includeModalDelete();
  },

  ajaxError : function() {

  },

  includeModalDelete : function() {
    $('a.modal_delete').live('click', function(event){
      event.preventDefault();
      var html = '<div id="emailDelete" ' +
                      'class="modal hide fade" ' +
                      'tabindex="-1" ' +
                      'role="dialog" ' +
                      'aria-labelledby="myModalLabel" ' +
                      'aria-hidden="true">' +
          '<div class="modal-header">' +
          '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
          '<h3 id="myModalLabel">' + $(this).attr('title') + '</h3>' +
          '</div>' +
          '<div class="modal-body">' +
          '<p>' + $(this).attr('question') + '</p>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' +
          '<a class="btn btn-danger" href="' + $(this).attr('href') + '">Delete</a>' +
          '</div>' +
          '</div>';

      $('body').append(html);

      $('#emailDelete').modal().on('hidden', function () { $(this).remove(); });
    });
  }

};