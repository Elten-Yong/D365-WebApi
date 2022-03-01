function ValidateDateTime(e) {
	//2021-11-16T16:00:00Z
	var dateCondition = false;
	var formContext = e.getFormContext();
	Xrm.Page.getAttribute("app_datetime").setRequiredLevel("required");
	Xrm.Page.getAttribute("app_text").setRequiredLevel("required");
	Xrm.Page.getAttribute("app_lookup").setRequiredLevel("required");
	Xrm.Page.getAttribute("app_customer").setRequiredLevel("required");

	var date = formContext.getAttribute("app_datetime").getValue();
	var dateFieldValue = Date.parse(date);
	var dateData = Date.now();
	var errorDateid = "errorDate";

	if (dateData < dateFieldValue) {
		formContext.getControl("app_datetime").setNotification("Cannot larger than today.", errorDateid);
		formContext.getAttribute("app_datetime").addOnChange(timeChange);

	} else {
		dateCondition = true;

	}

	function timeChange(e) {
		formContext.getControl("app_datetime").clearNotification(errorDateid);
	}

	// var nameField = formContext.getAttribute("app_name").getValue();
	var textField = formContext.getAttribute("app_text").getValue();
	var optionField = formContext.getAttribute("app_optionset").getValue();
	var multiOptionField = formContext.getAttribute("app_multioptionset").getValue();
	var lookUpField = formContext.getAttribute("app_lookup").getValue();
	var idAccount = String(lookUpField[0].id).replace(/^{+|}+$/gm, '');
	var accountsData = "/accounts(" + idAccount + ")";


	var customerField = formContext.getAttribute("app_customer").getValue();
	var customerData = `/${customerField[0].entityType}s(${customerField[0].id.slice(1, -1)})`;

	//var test = textField + ", " + multiOptionField + ", " + optionField + ", " + lookUpField[0].name + ", " + lookUpField[0].id + ", " + lookUpField[0].entityType + ", " + customerField;
	//console.log(test);

	if (nameField !== null && textField !== null && optionField !== null && multiOptionField !== null && lookUpField !== null && Boolean(dateCondition) && customerField !== null) {

		var year = date.getFullYear();
		var month = date.getMonth();
		var day = date.getDate();
		var dateOneMonth = addMonths(new Date(parseInt(year), parseInt(month), parseInt(day)), 1);
		var dateData = new Date(dateOneMonth);

		//name for the add month
		var year1 = dateData.getFullYear() + "";
		var month1 = (dateData.getMonth() + 1) + "";
		var day1 = dateData.getDate() + "";
		var dateFormat = year1 + "-" + month1 + "-" + day1;
		var textString = formContext.getAttribute("app_text").getValue();
		var nameField = textString + " - " + dateFormat;

		if (customerField[0].entityType === "account") {
			var data =
			{
				"app_name": nameField,
				"app_text": textField,
				"app_optionset": optionField,
				"app_multioptionset": String(multiOptionField),
				"app_datetime": dateData,
				"app_lookup@odata.bind": accountsData,
				"app_customer_account@odata.bind": customerData
			}
		} else {
			var data =
			{
				"app_name": nameField,
				"app_text": textField,
				"app_optionset": optionField,
				"app_multioptionset": String(multiOptionField),
				"app_datetime": dateData,
				"app_lookup@odata.bind": accountsData,
				"app_customer_contact@odata.bind": customerData
			}
        }

		// create account record
		Xrm.WebApi.createRecord("app_parent", data).then(
			function success(result) {
				console.log("Parent created with ID: " + result.id);
				// perform operations on record creation
			},
			function (error) {
				console.log(error.message);
				// handle error conditions
			}
		);

	}

	function addMonths(date, months) {
		var d = date.getDate();
		date.setMonth(date.getMonth() + +months);
		if (date.getDate() != d) {
			date.setDate(0);
		}
		return date;
	}


}
