function waitForKeyElements_nested (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector,  /* Optional: If set, identifies the iframe to
                        search.
                    */
    iframeSelector2, /* Optional: If set, identifies the nested iframe  to
                        search.
                    */
     CaptWait
) {
    var targetNodes_nest, tempNodes, tempNodes1, btargetsFound_nest,solved;

        if (typeof iframeSelector == "undefined")
            targetNodes_nest     = $(selectorTxt);
        else if (typeof iframeSelector2 == "undefined"){
            targetNodes_nest     = $(iframeSelector).contents ()
                .find (selectorTxt);
        } else if (CaptWait =="Y"){
            //alert("ifrmSeat" + $("#ifrmSeat").contents());
            tempNodes = $(iframeSelector);
            //solved = document.getElementById('ifrmSeat').contentWindow.document.getElementById('rcckYN');
            solved=$('iframe[name=ifrmSeat]').contents().find('#rcckYN');

            if (typeof solved.val() == "undefined" ){
                targetNodes_nest = $('iframe[name=ifrmSeat]').contents();
            }
            //solved= tempNodes.contentWindow.document.querySelectorAll("#rcckYN");

            if(solved.val() =="Y"){
                targetNodes_nest = solved;
            }
        }
        else {
            tempNodes   = $(iframeSelector).contents ();
            //alert(iframeSelector + "," + tempNodes);
            if(tempNodes)
                tempNodes1 = tempNodes.find(iframeSelector2);
            //alert(iframeSelector2 + "," + tempNodes1);
            if(tempNodes1){
                targetNodes_nest=tempNodes1.contents ()
                    .find (selectorTxt);
                //alert(selectorTxt + "," + "," + tempNodes1 + "," + targetNodes_nest);
            }
            //alert(selectorTxt + "," + targetNodes_nest);


        }

    if (targetNodes_nest &&  targetNodes_nest.length > 0) {
        btargetsFound_nest   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        //alert(selectorTxt + "," + "," + tempNodes1 + "," + targetNodes_nest);
        targetNodes_nest.each ( function () {
            var jThis_nest        = $(this);
            var alreadyFound_nest = jThis_nest.data ('alreadyFound_nest')  ||  false;

            if (!alreadyFound_nest) {
                //--- Call the payload function.
                var cancelFound_nest     = actionFunction (jThis_nest);
                if (cancelFound_nest)
                    btargetsFound_nest   = false;
                else
                    jThis_nest.data ('alreadyFound_nest', true);
            }
        } );
    }
    else {
        btargetsFound_nest  = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj_nest      = waitForKeyElements_nested.controlObj_nest  ||  {};
    var controlKey_nest      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl_nest     = controlObj_nest [controlKey_nest];

    //--- Now set or clear the timer as appropriate.
       // alert(btargetsFound_nest +"bWaitOnce=" +bWaitOnce + "timeControl_nest=" + timeControl_nest);
    if (btargetsFound_nest  &&  bWaitOnce  &&  timeControl_nest) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl_nest);
        delete controlObj_nest [controlKey_nest]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl_nest) {
            timeControl_nest = setInterval ( function () {
                    waitForKeyElements_nested (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector,
                                               iframeSelector2,CaptWait
                                        );
                },
                300
            );
            controlObj_nest [controlKey_nest] = timeControl_nest;
        }
    }
    waitForKeyElements_nested.controlObj_nest   = controlObj_nest;
}
