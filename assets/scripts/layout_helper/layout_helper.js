function fieldRestriction(e) {
    var key;
    var keychar;

    if (window.event)
      key = window.event.keyCode;
    else if (e)
      key = e.which;
    else
      return true;
    keychar = String.fromCharCode(key);
    keychar = keychar.toLowerCase();

  // control keys
    if ((key==null) || (key==0) || (key==8) ||
        (key==9) || (key==13) || (key==27) )
      return true;

  // alphas and numbers
    else if ((("abcdefghijklmnopqrstuvwxyz0123456789 _-").indexOf(keychar) > -1))
      return true;
    else
      return false;
}

var LayoutHelper = {

    Init : function()
    {
        $('select').chosen();
    },

    EncodeUrl : function(url){
        if(typeof(url)=='number')
            return url;

        if (url.indexOf("?")>0)
        {
            var encodedParams = "?";
            var parts = url.split("?");
            var params = parts[1].split("&");
            for(i = 0; i < params.length; i++)
            {
                if (i > 0)
                {
                    encodedParams += "&";
                }
                if (params[i].indexOf("=")>0) //Avoid null values
                {
                    p = params[i].split("=");
                    encodedParams += (p[0] + "=" + escape(encodeURI(p[1])));
                }
                else
                {
                    encodedParams += params[i];
                }
            }
            url = parts[0] + encodedParams;
        }

        return url;
    }

};
