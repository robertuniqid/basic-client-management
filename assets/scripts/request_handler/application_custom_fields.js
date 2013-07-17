Application.CustomFields = {

  fieldTypes : undefined,
  fieldTypeSelectHTML : '',
  fieldEdit : {
    id          : '',
    name        : '',
    type        : '',
    is_required : ''
  },

  Init : function(field_types) {

    if(typeof field_types == "string")
      this.fieldTypes = $.parseJSON(field_types);
    else
      this.fieldTypes = field_types;


    var options_html = '';

    $.each(this.fieldTypes, function(key, value){

      options_html += '<option value="' + key + '">' + value + '</option>';

    });

    Application.CustomFields.fieldTypeSelectHTML = '<select id="type" name="type">' +
                                                    options_html +
                                                   '</select>';
    Application.CustomFields._init();
  },

  _init : function() {
    $('#add_custom_field').click(function(event){
      event.preventDefault();

      LayoutHelper.Popup.Modal(
          'Add Custom Field',
          Application.CustomFields._formHTML(),
          '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' +
              '<button class="btn btn-primary add_entry">Add Custom Field</button>',
          Application.CustomFields.setAddFieldModalAction,
          false
      );
    });

    $('#management_table .edit').live('click', function(event){
      event.preventDefault();

      var tr = $(this).parents('tr');

      Application.CustomFields.fieldEdit['id']          = tr.attr('entry_id');
      Application.CustomFields.fieldEdit['name']        = tr.find('td[field="name"]').html();
      Application.CustomFields.fieldEdit['type']        = tr.find('td[field="type"]').attr('data-real-value');
      Application.CustomFields.fieldEdit['is_required'] = tr.find('td[field="is_required"]').attr('data-real-value');

      LayoutHelper.Popup.Modal(
          'Edit Custom Field',
          Application.CustomFields._formHTML(),
          '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' +
              '<button class="btn btn-primary edit_entry">Edit Custom Field</button>',
          Application.CustomFields.setEditFieldModalAction,
          false
      );
    });

    $('#management_table .delete').live('click', function(event){
      event.preventDefault();

      LayoutHelper.Popup.Modal(
          'Delete Custom Field',
          'Delete ' + $(this).parents('tr').find('td[field="name"]').html(),
          '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' +
              '<button class="btn btn-danger delete_entry" entry_id="'
              + $(this).parents('tr').attr('entry_id')
              + '">Delete Custom Field</button>',
          Application.CustomFields.setDeleteModalAction,
          false
      );
    });
  },

  _formHTML : function() {
    var html = '<form>' +
              '<input type="hidden" name="id" value="0"/>' +
              '<label for="name" class="left" style="width:150px;">Name</label>' +
              '<input id="name" name="name" type="text" class="field" value="" onKeyPress="return fieldRestriction(event)">' +
              '<div class="clear"></div>' +
              '<div class="alert alert-info">Characters allowed : numbers , characters , - , _ </div> ' +
              '<div class="clear"></div>' +
              '<label for="type" class="left" style="width:150px;">Type</label>' +
                Application.CustomFields.fieldTypeSelectHTML +
              '<div class="clear"></div>' +
              '<label for="is_required" class="left" style="width:150px;">Is Required</label>' +
              '<input type="checkbox" name="is_required" value="1"/>' +
              '<div class="clear"></div>' +
           '</form>';
    return html;
  },

  setAddFieldModalAction : function() {
    LayoutHelper.Popup.GetModalObject().find('button.add_entry').bind('click', function(event){
      event.preventDefault();

      var name = LayoutHelper.Popup.GetModalObject().find('[name="name"]').val();
      var type = LayoutHelper.Popup.GetModalObject().find('[name="type"]').val();
      var is_checked = LayoutHelper.Popup.GetModalObject().find('[name="is_required"]').is(':checked') ? 1 : 0;

      if($('#notification_no_entries').length > 0) {
        $('#notification_no_entries').slideUp('slow', function(){
          $(this).remove();
        });
      }

      LayoutHelper.Popup.ModalClose();

      if($('#success').length > 0) {
        $('#success').slideUp('slow', function(){
          $('#add_custom_field').after(
              '<div id="loading" class="alert alert-info" style="display: none">' +
                  '<button class="close" data-dismiss="alert" type="button">+</button>' +
                  'The custom field is being added, please wait...' +
              '</div>'
          );

          $('#loading').slideDown('slow');

          Application.CustomFields.AddField(name, type, is_checked);
        });
      } else {
          $('#add_custom_field').after(
              '<div id="loading" class="alert alert-info" style="display: none">' +
                  '<button class="close" data-dismiss="alert" type="button">+</button>' +
                  'The custom field is being added, please wait...' +
              '</div>'
          );

          $('#loading').slideDown('slow');

          Application.CustomFields.AddField(name, type, is_checked);
      }
    });
  },

  AddField : function(name, type, is_required) {
    try{
      var JsonClient = new AjaxFramework.Client();
      JsonClient.setAjaxMethod('ClientCustomField.add');
      JsonClient.setData({
        name        : name,
        type        : type,
        is_required : is_required
      });
      JsonClient.setRequestMethod('POST');
      JsonClient.setResponseGlue('JSON');
      JsonClient.setOkCallBack(Application.CustomFields.ajaxAddFieldOk);
      JsonClient.setErrorCallBack(Application.ajaxError());
      JsonClient.Run();
    } catch(ex){
      console.log(ex);
    }
  },

  ajaxAddFieldOk : function(data){
    $('#loading').slideUp('slow', function(){
      $(this).remove();

      $('#add_custom_field').after(
          '<div id="success" class="alert alert-success" style="display: none">' +
              '<button class="close" data-dismiss="alert" type="button">+</button>' +
              'Success !<br/>The custom field has been successfully added' +
          '</div>'
      );

      $('#success').slideDown('slow');

      $('#management_table').append(data.entry_html);

      if($('#management_table').is(':hidden'))
        $('#management_table').slideDown('slow');
    });

  },

  setEditFieldModalAction : function() {

    LayoutHelper.Popup.GetModalObject().find('[name="id"]').val(Application.CustomFields.fieldEdit.id);
    LayoutHelper.Popup.GetModalObject().find('[name="name"]').val(Application.CustomFields.fieldEdit.name);
    LayoutHelper.Popup.GetModalObject().find('[name="type"]').val(Application.CustomFields.fieldEdit.type);

    if(Application.CustomFields.fieldEdit.is_required == 1)
      LayoutHelper.Popup.GetModalObject().find('[name="is_required"]').attr('checked', 'checked');

    LayoutHelper.Popup.GetModalObject().find('button.edit_entry').bind('click', function(event){
      event.preventDefault();

      var id   = LayoutHelper.Popup.GetModalObject().find('[name="id"]').val();
      var name = LayoutHelper.Popup.GetModalObject().find('[name="name"]').val();
      var type = LayoutHelper.Popup.GetModalObject().find('[name="type"]').val();
      var is_checked = LayoutHelper.Popup.GetModalObject().find('[name="is_required"]').is(':checked') ? 1 : 0;

      if($('#notification_no_entries').length > 0) {
        $('#notification_no_entries').slideUp('slow', function(){
          $(this).remove();
        });
      }

      LayoutHelper.Popup.ModalClose();

      if($('#success').length > 0) {
        $('#success').slideUp('slow', function(){
          $('#add_custom_field').after(
              '<div id="loading" class="alert alert-info" style="display: none">' +
                '<button class="close" data-dismiss="alert" type="button">+</button>' +
                'The custom field is being edited, please wait...' +
              '</div>'
          );

          $('#loading').slideDown('slow');

          Application.CustomFields.EditField(id, name, type, is_checked);
        });
      } else {
        $('#add_custom_field').after(
            '<div id="loading" class="alert alert-info" style="display: none">' +
              '<button class="close" data-dismiss="alert" type="button">+</button>' +
              'The custom field is being edited, please wait...' +
            '</div>'
        );

        $('#loading').slideDown('slow');

        Application.CustomFields.EditField(id, name, type, is_checked);
      }
    });
  },

  EditField : function(id, name, type, is_required) {
    try{
      var JsonClient = new AjaxFramework.Client();
      JsonClient.setAjaxMethod('ClientCustomField.edit');
      JsonClient.setData({
        id          : id,
        name        : name,
        type        : type,
        is_required : is_required
      });
      JsonClient.setRequestMethod('POST');
      JsonClient.setResponseGlue('JSON');
      JsonClient.setOkCallBack(Application.CustomFields.ajaxEditFieldOk);
      JsonClient.setErrorCallBack(Application.ajaxError());
      JsonClient.Run();
    } catch(ex){
      console.log(ex);
    }
  },

  ajaxEditFieldOk : function(data){
    $('#loading').slideUp('slow', function(){
      $(this).remove();

      $('#add_custom_field').after(
          '<div id="success" class="alert alert-success" style="display: none">' +
              '<button class="close" data-dismiss="alert" type="button">+</button>' +
              'Success !<br/>The custom field has been successfully added' +
          '</div>'
      );

      $('#success').slideDown('slow');

      var current_displayed = $('#management_table').find('tr[entry_id="' + data.entry_id + '"]');

      current_displayed.after(data.entry_html);
      current_displayed.remove();


      if($('#management_table').is(':hidden'))
        $('#management_table').slideDown('slow');
    });
  },

  setDeleteModalAction : function() {
    LayoutHelper.Popup.GetModalObject().find('button.delete_entry').bind('click', function(event){
      event.preventDefault();

      var entry_id = $(this).attr('entry_id');

      LayoutHelper.Popup.ModalClose();

      Application.CustomFields.DeleteField(entry_id);
    });
  },

  DeleteField : function(id) {
    try{
      var JsonClient = new AjaxFramework.Client();
      JsonClient.setAjaxMethod('ClientCustomField.delete');
      JsonClient.setData({
        id          : id
      });
      JsonClient.setRequestMethod('POST');
      JsonClient.setResponseGlue('JSON');
      JsonClient.setOkCallBack(Application.CustomFields.ajaxDeleteFieldOk);
      JsonClient.setErrorCallBack(Application.ajaxError());
      JsonClient.Run();
    } catch(ex){
      console.log(ex);
    }
  },

  ajaxDeleteFieldOk : function(data){
    $('#add_custom_field').after(
        '<div id="success-delete" class="alert alert-success" style="display: none">' +
            '<button class="close" data-dismiss="alert" type="button">+</button>' +
            'Success !<br/>The custom field has been successfully <span class="text-error">deleted</span>' +
        '</div>'
    );

    $('#success-delete').slideDown('slow');

    var current_displayed = $('#management_table').find('tr[entry_id="' + data.entry_id + '"]');

    current_displayed.slideUp('slow', function(){
      $(this).remove();
    });
  }

};