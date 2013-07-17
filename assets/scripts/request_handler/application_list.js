Application.List = {

  Init : function() {
    var operations_container = $('#entries-display').find('td.operations');

    operations_container.find('a.view').bind('click', function(event){
      event.preventDefault();

      Application.List.ShowClientInformation($(this).parents('tr').attr('entry_id'));
    });

    operations_container.find('a.flag').bind('click', function(event){
      event.preventDefault();

      $(this).parents('ul').find('li').removeClass('active');
      $(this).parents('li').addClass('active');

      Application.List.ChangeClientFlag($(this).parents('tr').attr('entry_id'), $(this).attr('flag_id'));
    });

    this._includeCompactAndExtractOptions();
  },

  _includeCompactAndExtractOptions : function() {
    var table = $('#entries-display');

    // Just in case if I need more of these

    table.find('.compact-buttons').bind('click', function() {
      var current_table = $(this).parents('table');

      current_table.find('.compact-buttons').hide();
      current_table.find('.extract-buttons').show();

      current_table.find('.compacted-buttons').show();
      current_table.find('.extracted-buttons').hide();

      current_table.find('td.operations').width('250px');
    });

    table.find('.extract-buttons').bind('click', function() {
      var current_table = $(this).parents('table');

      current_table.find('.extract-buttons').hide();
      current_table.find('.compact-buttons').show();

      current_table.find('.extracted-buttons').show();
      current_table.find('.compacted-buttons').hide();
      current_table.find('td.operations').width('400px');
    });
  },

  ChangeClientFlag : function(entry_id, flag_id) {
    try{
      var JsonClient = new AjaxFramework.Client();
      JsonClient.setAjaxMethod('Client.changeFlag');
      JsonClient.setData({
        entry_id : entry_id,
        flag_id  : flag_id
      });
      JsonClient.setRequestMethod('POST');
      JsonClient.setResponseGlue('JSON');
      JsonClient.setOkCallBack(Application.List.ajaxChangeClientFlagOk);
      JsonClient.setErrorCallBack(Application.ajaxError());
      JsonClient.Run();
    } catch(ex){
      console.log(ex);
    }
  },

  ajaxChangeClientFlagOk : function(data){
    var tr = $('#entries-display').find('tr[entry_id="' + data.entry_id + '"]');
    tr.removeClass(data.previous_flag_class);
    tr.addClass(data.new_flag_class);
  },

  ShowClientInformation : function(entry_id) {
    try{
      var JsonClient = new AjaxFramework.Client();
      JsonClient.setAjaxMethod('Client.getInformation');
      JsonClient.setData({
        entry_id : entry_id
      });
      JsonClient.setRequestMethod('POST');
      JsonClient.setResponseGlue('JSON');
      JsonClient.setOkCallBack(Application.List.ajaxShowClientInformationOk);
      JsonClient.setErrorCallBack(Application.ajaxError());
      JsonClient.Run();
    } catch(ex){
      console.log(ex);
    }
  },

  ajaxShowClientInformationOk : function(data){
    if(data.status == 'ok') {
      var window_size = $(window).width();

      LayoutHelper.Popup.Modal('Client Information', data.html, false, false, window_size * 0.8);
    } else {
      LayoutHelper.Popup.ShowErrors(data.errors);
    }
  }

};