function getRelatedInfo(e) {

    // Get the Form Context
    var formContext = e.getFormContext();
    var infoId = "info";
    var recordGuid = "26cb4124-0149-ec11-8c62-00224816e6d3";

    // If the recordGuid contains data
    if (recordGuid != null && formContext.getAttribute("app_name").getValue() == null) {
        // Use the WebApi to get data    
        Xrm.WebApi.retrieveRecord("app_setting", recordGuid, "?$select=app_text, app_datetime, app_optionset, app_multioptionset&$expand=app_lookup($select=accountid,name)").then(

            // If successful, set variables for the results 
            function success(result) {

                var textSetting = result.app_text;

                var optionsetSettingValue = result.app_optionset;


                var multiOptionsetSetting = result.app_multioptionset;

                const myArray = multiOptionsetSetting.split(",");

                let result1 = myArray.map(i => Number(i));
                var datetimeSetting = result.app_datetime;

                var dateData = new Date(datetimeSetting);

                var year1 = dateData.getFullYear() + "";
                var month1 = (dateData.getMonth() + 1) + "";
                var day1 = dateData.getDate() + "";
                var dateFormat = year1 + "-" + month1 + "-" + day1;

                var nameField = textSetting + " - " + dateFormat;

                //var lookupSetting = result.new_lookup1;
                var lookupSetting = new Array(); //[]
                lookupSetting[0] = new Object; //{}
                lookupSetting[0].id = result.app_lookup.accountid;
                lookupSetting[0].name = result.app_lookup.name;
                lookupSetting[0].entityType = "account";

                // Set the form fields
                formContext.getAttribute("app_name").setValue(nameField);

                formContext.getAttribute("app_text").setValue(textSetting);

                formContext.getAttribute("app_optionset").setValue(optionsetSettingValue);

                formContext.getAttribute("app_multioptionset").setValue(result1);

                formContext.getAttribute("app_datetime").setValue(dateData);

                formContext.getAttribute("app_lookup").setValue(lookupSetting);

                formContext.getControl("app_optionset").setDisabled(true);
                formContext.getControl("app_multioptionset").setDisabled(true);


                formContext.ui.setFormNotification("All values populate from setting.", "INFO", infoId);

            },
            // If there's an error in the WebApi call, log the error and alert the user
            function (error) {
                console.log(error.message);
                // handle error conditions
                var errorMessage = 'Error: An error occurred in the GetRelatedInfo function: ' + error.message;
                var alertStrings = { confirmButtonLabel: "Yes", text: errorMessage };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function success(result) {
                        console.log("Alert dialog closed");
                    },
                    function (error) {
                        console.log(error.message);
                    }
                );
            }
        );
    }
}