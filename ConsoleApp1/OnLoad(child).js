function ChildOnLoad(e) {
    var formContext = e.getFormContext();
    formContext.getControl("app_datetime").setDisabled(true);
    formContext.getAttribute("app_lookup").addOnChange(parentLookUp);

    function parentLookUp(e) {
        //formContext.getControl("app_datetime").clearNotification(errorDateid);
        
        var lookupField = formContext.getAttribute("app_lookup").getValue();
        let id = lookupField[0].id;

        Xrm.WebApi.retrieveRecord("app_parent", id, "?$select=app_datetime").then(
            function success(result) {
                let datetimeGet = result.app_datetime;
                let datetime = new Date(datetimeGet);
                formContext.getAttribute("app_datetime").setValue(datetime);
                
            },
            function (error) {
                console.log(error.message);
                // handle error conditions
            }
        );
    }
}
