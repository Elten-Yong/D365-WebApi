function getRelatedInfo(e) {

	// Get the Form Context
	var formContext = e.getFormContext();
	Xrm.Page.getAttribute("app_datetime").setRequiredLevel("required");
	Xrm.Page.getAttribute("app_text").setRequiredLevel("required");
	Xrm.Page.getAttribute("app_lookup").setRequiredLevel("required");
	Xrm.Page.getAttribute("app_customer").setRequiredLevel("required");

	let containDate = false;
	let containDateData = "";
	//check date
	if (formContext.getAttribute("app_datetime").getValue() !== null) {
		containDate = true;
		containDateData = formContext.getAttribute("app_datetime").getValue();
	}


	var infoId = "info";
	var recordGuid = "1f133433-354c-ec11-8f8e-002248166511";


	// If the recordGuid contains data
	if (recordGuid != null && formContext.getAttribute("app_name").getValue() == null) {
		// Use the WebApi to get data    
		Xrm.WebApi.retrieveRecord("app_setting", recordGuid, "?$select=app_text, app_datetime, app_optionset, app_multioptionset,_app_customer_value&$expand=app_lookup($select=accountid,name)").then(

			// If successful, set variables for the results 
			function success(result) {

				var textSetting = result.app_text;

				var optionsetSettingValue = result.app_optionset;


				var multiOptionsetSetting = result.app_multioptionset;

				const myArray = multiOptionsetSetting.split(",");

				let myArrayresult = myArray.map(i => Number(i));
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

				formContext.getAttribute("app_multioptionset").setValue(myArrayresult);

				formContext.getAttribute("app_datetime").setValue(dateData);

				formContext.getAttribute("app_lookup").setValue(lookupSetting);

				formContext.getControl("app_optionset").setDisabled(true);
				formContext.getControl("app_multioptionset").setDisabled(true);

				Xrm.WebApi.retrieveRecord("account", result._app_customer_value, "?$select=name").then(
					function success(result1) {

						//accountTable = true;
						//console.log("account" + accountTable);
						formContext.getAttribute("app_customer").setValue([{
							id: result._app_customer_value,
							name: result1.name,
							entityType: "account"
						}]);
						// perform operations on record retrieval
					},
					function (error1) {
						console.log(error1.message);
						// handle error conditions
					}
				);

				Xrm.WebApi.retrieveRecord("contact", result._app_customer_value, "?$select=firstname,lastname").then(
					function success(result1) {

						//contactTable = true;
						//console.log("contact" + contactTable);
						formContext.getAttribute("app_customer").setValue([{
							id: result._app_customer_value,
							name: result1.firstname + result1.lastname,
							entityType: "contact"
						}]);
						// perform operations on record retrieval
					},
					function (error1) {
						console.log(error1.message);
						// handle error conditions
					}
				);


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

	//add onChange
	formContext.getAttribute("app_datetime").addOnChange(onChangeFunction);
	formContext.getAttribute("app_text").addOnChange(onChangeFunction);

	//add OnSave
	formContext.data.entity.addOnSave(onSaveEvent);



	//onsave
	function onSaveEvent(e) {
		//2021-11-16T16:00:00Z
		var dateCondition = false;
		var formContext = e.getFormContext();


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

		//duplicate record
		if (nameField !== null && textField !== null && optionField !== null && multiOptionField !== null && lookUpField !== null && Boolean(dateCondition) && customerField !== null && !Boolean(containDate)) {

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

		//Update Child record
		if (Boolean(containDate) && (containDateData !== formContext.getAttribute("app_datetime").getValue())) {
			let id = formContext.data.entity.getId().slice(1, -1);
			let options = `?$select=app_datetime&$filter=_app_lookup_value eq ${id} `;
			let dateData1 = new Date(formContext.getAttribute("app_datetime").getValue());

			let data =
			{
				"app_datetime": dateData1

			}
			Xrm.WebApi.retrieveMultipleRecords("app_child", options).then(
				function success(result) {
					for (var i = 0; i < result.entities.length; i++) {
						//console.log(result.entities[i]);


						Xrm.WebApi.updateRecord("app_child", result.entities[i].app_childid, data).then(
							function success(result1) {
								console.log("Children updated");
								// perform operations on record update
							},
							function (error) {
								console.log(error.message);
								// handle error conditions
							}
						);
					}
					// perform additional operations on retrieved records
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

	//onchange
	function onChangeFunction(e) {
		var formContext = e.getFormContext();

		var dateFieldValue = formContext.getAttribute("app_datetime").getValue();

		var year = dateFieldValue.getFullYear() + "";
		var month = (dateFieldValue.getMonth() + 1) + "";
		var day = dateFieldValue.getDate() + "";
		var dateFormat = year + "-" + month + "-" + day;

		var textString = formContext.getAttribute("app_text").getValue();

		var textSetting = textString + " - " + dateFormat;

		formContext.getAttribute("app_name").setValue(textSetting);

	}
}