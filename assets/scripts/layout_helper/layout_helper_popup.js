LayoutHelper.Popup = {

    settings : {
        modal_id : 'simple-modal'
    },

    Init : function()
    {
        console.log('Layout Helper');
    },

    ShowErrors : function(errors){
        alert('Not Yet Implemented');
    },

    Modal : function(title, content, footer, after_load, large_popup) {
        if($('#' + LayoutHelper.Popup.settings.modal_id).length > 0) {
            $('#' + LayoutHelper.Popup.settings.modal_id).on('hidden', function () {
                LayoutHelper.Popup.Modal(title, content, footer, after_load, large_popup);
            }).modal('hide');

            return false;
        }

        footer = typeof footer == "undefined"
                  || footer == false? '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' : footer;


        var html = '<div id="' + LayoutHelper.Popup.settings.modal_id + '" ' +
                        'class="modal hide fade" ' +
                        'tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';

        html += '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>' +
                    '<h3 id="myModalLabel">' + title + '</h3>' +
                '</div>';

        if(footer == false)
            html += content;
        else
            html += '<div class="modal-body">' + content + '</div>'
                 +  '<div class="modal-footer">' + footer + '</div>';

        html += '</div>';

        $('body').append(html);

        var theModal = $('#' + LayoutHelper.Popup.settings.modal_id);

        theModal.on('hidden', function () {
            $('#' + LayoutHelper.Popup.settings.modal_id).remove();
        });

        if(large_popup == true) {
            theModal.modal('show').css({
                'width': function () {
                    return ($(document).width() * .9) + 'px';
                },
                'margin-left': function () {
                    return -($(this).width() / 2);
                }
            });
        } else if(parseInt(large_popup) != 0) {
            theModal.modal('show').css({
                'width': function () {
                    return large_popup;
                },
                'margin-left': function () {
                    return -($(this).width() / 2);
                }
            });
        } else {
            theModal.modal('show');
        }

        if(typeof after_load !== "undefined" && after_load != false)
            after_load.call({
                'modal' : theModal
            });
    },

    GetModalObject : function() {
        return $('#' + LayoutHelper.Popup.settings.modal_id);
    },

    ModalClose : function() {
        $('#' + LayoutHelper.Popup.settings.modal_id).modal('hide');
    }

};
