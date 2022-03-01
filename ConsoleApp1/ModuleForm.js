var App = App || {};
App.Pana1 = App.Pana1 || {};
App.Pana1.AppEntity = (() => {
	"use strict";

	// constants for this form
	const
		entity = {
			parent: { //app_parent
				entityName: "app_parent",
				parentId: "app_parentid",
				text: "app_text",
				name: "app_name",
				optionSet: "app_optionset",
				multiOptionSet: "app_multioptionset",
				dateTime: "app_datetime",
				lookUp: "app_lookup",
				customer: "app_customer",
				wholeNumber: "app_wholenumber"

			},
			child: {
				entityName: "app_child",
				childId: "app_childid",
				name: "app_name",
				dateTime: "app_datetime",
				lookUp: "app_lookup",
				wholeNumber: "app_wholenumber"

			},
			setting: {
				entityName: "app_setting",
				childId: "app_settingid",
				text: "app_text",
				name: "app_name",
				optionSet: {
					item1: 750250000,
					item2: 750250001
				},
				multiOptionSet: {
					item1: 750250000,
					item2: 750250001
				},
				dateTime: "app_datetime",
				lookUp: "app_lookup",
				customer: "app_customer"
			},
			account: {
				entityName: "account",
			},
			contact: {
				entityName: "contact",
			},
		},
		message = {
			formSettingToParent: "All values populate from setting.",
			errorMessage: 'Error: An error occurred in the GetRelatedInfo function: ',
			alertDialogClose: "Alert dialog closed",
			dateCannotLarger: "Cannot larger than today.",
			childUpdate: "Children updated"

		},
		queryOption = {
			queryOnloadFromSetting: "?$select=app_text, app_datetime, app_optionset, app_multioptionset,_app_customer_value&$expand=app_lookup($select=accountid,name)",
			queryOnloadCustomerAccount: "?$select=name",
			queryOnloadCustomerContact: "?$select=firstname,lastname",
			queryUpdateChild: "?$select=app_datetime&$filter=_app_lookup_value",
			queryChildOnchange: "?$select=app_datetime"

		},
		value = {
			recordGuid: "1f133433-354c-ec11-8f8e-002248166511",
			infoId: "info",
			info: "INFO",
			required: "required",
			errorDateid: "errorDate"

		};


	const Module1 = (() => {

		//onload
		const function1 = (executionContext) => {
			//        if (formContext.getAttribute(entity.parent.dateTime).getValue() !== null) {
			//entity.value.containDate = true;
			//entity.value.containDateData = formContext.getAttribute(entity.parent.dateTime).getValue();
			//        }

			const formContext =App.Helper.GetFormContext();
			Xrm.Page.getAttribute(entity.parent.dateTime).setRequiredLevel(value.required);
			//App.Helper.SetRequiredLevel(formContext, entity.parent.dateTime, value.required);
			Xrm.Page.getAttribute(entity.parent.text).setRequiredLevel(value.required);
			Xrm.Page.getAttribute(entity.parent.lookUp).setRequiredLevel(value.required);
			Xrm.Page.getAttribute(entity.parent.customer).setRequiredLevel(value.required);
			formContext.getControl(entity.parent.optionSet).setDisabled(true);
			formContext.getControl(entity.parent.multiOptionSet).setDisabled(true);

			if (value.recordGuid !== null && formContext.ui.getFormType() === 1) {
				// Use the WebApi to get data    
				Xrm.WebApi.retrieveRecord(entity.setting.entityName, value.recordGuid, queryOption.queryOnloadFromSetting).then(

					// If successful, set variables for the results 
					function success(result) {

						const textSetting = result.app_text;

						const optionsetSettingValue = result.app_optionset;


						const multiOptionsetSetting = result.app_multioptionset;

						const myArray = multiOptionsetSetting.split(",");

						const myArrayresult = myArray.map(i => Number(i));
						const datetimeSetting = result.app_datetime;

						const dateData = new Date(datetimeSetting);

						const year1 = dateData.getFullYear() + "";
						const month1 = (dateData.getMonth() + 1) + "";
						const day1 = dateData.getDate() + "";
						const dateFormat = year1 + "-" + month1 + "-" + day1;

						const nameField = textSetting + " - " + dateFormat;

						//var lookupSetting = result.new_lookup1;
						var lookupSetting = []; //[]
						lookupSetting[0] = {}; //{}
						lookupSetting[0].id = result.app_lookup.accountid;
						lookupSetting[0].name = result.app_lookup.name;
						lookupSetting[0].entityType = entity.account.entityName;

						// Set the form fields
						formContext.getAttribute(entity.parent.name).setValue(nameField);

						formContext.getAttribute(entity.parent.text).setValue(textSetting);

						formContext.getAttribute(entity.parent.optionSet).setValue(optionsetSettingValue);

						formContext.getAttribute(entity.parent.multiOptionSet).setValue(myArrayresult);

						formContext.getAttribute(entity.parent.dateTime).setValue(dateData);

						formContext.getAttribute(entity.parent.lookUp).setValue(lookupSetting);



						Xrm.WebApi.retrieveRecord(entity.account.entityName, result._app_customer_value, queryOption.queryOnloadCustomerAccount).then(
							function success(result1) {

								formContext.getAttribute(entity.parent.customer).setValue([{
									id: result._app_customer_value,
									name: result1.name,
									entityType: entity.account.entityName
								}]);
								// perform operations on record retrieval
							},
							function (error1) {
								console.log(error1.message);
								// handle error conditions
							}
						);

						Xrm.WebApi.retrieveRecord(entity.contact.entityName, result._app_customer_value, queryOption.queryOnloadCustomerContact).then(
							function success(result1) {

								formContext.getAttribute(entity.parent.customer).setValue([{
									id: result._app_customer_value,
									name: result1.firstname + result1.lastname,
									entityType: entity.contact.entityName
								}]);
								// perform operations on record retrieval
							},
							function (error1) {
								console.log(error1.message);
								// handle error conditions
							}
						);


						formContext.ui.setFormNotification(message.formSettingToParent, value.info, value.infoId);

					},
					// If there's an error in the WebApi call, log the error and alert the user
					function (error) {
						console.log(error.message);
						// handle error conditions
						const errorMessage = message.errorMessage + error.message;
						const alertStrings = { confirmButtonLabel: "Yes", text: errorMessage };
						const alertOptions = { height: 120, width: 260 };
						Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
							function success(result) {
								console.log(message.alertDialogClose);
							},
							function (error) {
								console.log(error.message);
							}
						);
					}
				);
			}
			return executionContext;
		};

		//onchange
		const function2 = (executionContext) => {
			const formContext = executionContext.getFormContext();

			const dateFieldValue = formContext.getAttribute(entity.parent.dateTime).getValue();

			const year = dateFieldValue.getFullYear() + "";
			const month = (dateFieldValue.getMonth() + 1) + "";
			const day = dateFieldValue.getDate() + "";
			const dateFormat = year + "-" + month + "-" + day;

			const textString = formContext.getAttribute(entity.parent.text).getValue();

			const textSetting = textString + " - " + dateFormat;

			formContext.getAttribute(entity.parent.name).setValue(textSetting);
			return executionContext;
		};

		//onsave
		const function3 = (executionContext) => {
			let formContext = executionContext.getFormContext();


			let dateCondition = false;
			const date = formContext.getAttribute(entity.parent.dateTime).getValue();
			const dateFieldValue = Date.parse(date);
			const dateData = Date.now();


			if (dateData < dateFieldValue) {
				formContext.getControl(entity.parent.dateTime).setNotification(message.dateCannotLarger, value.errorDateid);
				formContext.getAttribute(entity.parent.dateTime).addOnChange(timeChange);

			} else {
				dateCondition = true;

			}

			function timeChange(e) {
				formContext.getControl(entity.parent.dateTime).clearNotification(value.errorDateid);
			}

			// var nameField = formContext.getAttribute("app_name").getValue();
			const textField = formContext.getAttribute(entity.parent.text).getValue();
			const optionField = formContext.getAttribute(entity.parent.optionSet).getValue();
			const multiOptionField = formContext.getAttribute(entity.parent.multiOptionSet).getValue();
			const lookUpField = formContext.getAttribute(entity.parent.lookUp).getValue();
			const accountsData = `/${lookUpField[0].entityType}s(${lookUpField[0].id.slice(1, -1)})`;


			const customerField = formContext.getAttribute(entity.parent.customer).getValue();
			const customerData = `/${customerField[0].entityType}s(${customerField[0].id.slice(1, -1)})`;

			//var test = textField + ", " + multiOptionField + ", " + optionField + ", " + lookUpField[0].name + ", " + lookUpField[0].id + ", " + lookUpField[0].entityType + ", " + customerField;
			//console.log(test);

			//duplicate record
			if (Boolean(dateCondition) && formContext.ui.getFormType() === 1) {

				const year = date.getFullYear();
				const month = date.getMonth();
				const day = date.getDate();
				const dateOneMonth = addMonths(new Date(parseInt(year), parseInt(month), parseInt(day)), 1);
				const dateData = new Date(dateOneMonth);

				//name for the add month
				const year1 = dateData.getFullYear() + "";
				const month1 = (dateData.getMonth() + 1) + "";
				const day1 = dateData.getDate() + "";
				const dateFormat = year1 + "-" + month1 + "-" + day1;
				const textString = formContext.getAttribute(entity.parent.text).getValue();
				const nameField = textString + " - " + dateFormat;

				if (customerField[0].entityType === entity.account.entityName) {
					const data =
					{
						"app_name": nameField,
						"app_text": textField,
						"app_optionset": optionField,
						"app_multioptionset": String(multiOptionField),
						"app_datetime": dateData,
						"app_lookup@odata.bind": accountsData,
						"app_customer_account@odata.bind": customerData
					};

					// create account record
					Xrm.WebApi.createRecord(entity.parent.entityName, data).then(
						function success(result) {
							console.log("Parent created with ID: " + result.id);
							// perform operations on record creation
						},
						function (error) {
							console.log(error.message);
							// handle error conditions
						}
					);

				} else {
					const data =
					{
						"app_name": nameField,
						"app_text": textField,
						"app_optionset": optionField,
						"app_multioptionset": String(multiOptionField),
						"app_datetime": dateData,
						"app_lookup@odata.bind": accountsData,
						"app_customer_contact@odata.bind": customerData
					};

					// create account record
					Xrm.WebApi.createRecord(entity.parent.entityName, data).then(
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

			}

			//Update Child record
			if (formContext.getAttribute(entity.parent.dateTime).getIsDirty() && formContext.ui.getFormType() === 2) {
				const idUpdate = formContext.data.entity.getId().slice(1, -1);
				const options = `${queryOption.queryUpdateChild} eq ${idUpdate} `;
				const dateData1 = new Date(formContext.getAttribute(entity.parent.dateTime).getValue());

				const data =
				{
					"app_datetime": dateData1

				};
				Xrm.WebApi.retrieveMultipleRecords(entity.child.entityName, options).then(
					function success(result) {
						for (let i = 0; i < result.entities.length; i++) {
							//console.log(result.entities[i]);


							Xrm.WebApi.updateRecord(entity.child.entityName, result.entities[i].app_childid, data).then(
								function success(result1) {
									console.log(message.childUpdate);
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


			return executionContext;
		};
		return {

			Function1: function1,
			Function2: function2,
			Function3: function3,

		};
	})();

	const formOnLoad = (executionContext) => {
		Module1.Function1(executionContext);

	};

	const fieldOnChangeParent = (executionContext) => {
		Module1.Function2(executionContext);
	};



	const formOnSave = (executionContext) => {
		Module1.Function3(executionContext);
	};

	return {
		// Field
		FieldOnChangeParent: fieldOnChangeParent,


		// Form
		FormOnLoad: formOnLoad,
		FormOnSave: formOnSave,

		// Command Bar


	};

})();



