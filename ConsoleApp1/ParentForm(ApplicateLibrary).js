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
			recordGuid: "a312dbb3-ea53-ec11-8f8e-000d3ac793d0",
			infoId: "info",
			info: "INFO",
			required: "required",
			errorDateid: "errorDate"

		};


	const Module1 = (() => {

		//onload
		const function1 = (executionContext) => {
		
			
			App.Helper.SetRequiredLevel(executionContext, entity.parent.dateTime, value.required);
			App.Helper.SetRequiredLevel(executionContext, entity.parent.text, value.required);
			App.Helper.SetRequiredLevel(executionContext, entity.parent.lookUp, value.required);
			App.Helper.SetRequiredLevel(executionContext, entity.parent.customer, value.required);
			App.Helper.SetRequiredLevel(executionContext, entity.parent.name, value.required);
			App.Helper.SetFieldDisabled(executionContext, entity.parent.optionSet, true);
			App.Helper.SetFieldDisabled(executionContext, entity.parent.multiOptionSet, true);

			
			if (value.recordGuid !== null && App.Helper.IsFormTypeCreate(executionContext)) {
				// Use the WebApi to get data    
				const retrievedRecord1 = App.Helper.RetrieveRecord(entity.setting.entityName, value.recordGuid, queryOption.queryOnloadFromSetting);
				retrievedRecord1.then(function (result) {
					// here you can use the result of promiseB
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

					// Set the form fields
					App.Helper.SetValue(executionContext, entity.parent.name, nameField);
					App.Helper.SetValue(executionContext, entity.parent.text, textSetting);
					App.Helper.SetValue(executionContext, entity.parent.optionSet, optionsetSettingValue);
					App.Helper.SetValue(executionContext, entity.parent.multiOptionSet, myArrayresult);
					App.Helper.SetValue(executionContext, entity.parent.dateTime, dateData);
					App.Helper.SetValueOfLookup(executionContext, entity.parent.lookUp, result.app_lookup.accountid, result.app_lookup.name, entity.account.entityName);
					
					const retrievedRecord2 = App.Helper.RetrieveRecord(entity.account.entityName, result._app_customer_value, queryOption.queryOnloadCustomerAccount);
					
					retrievedRecord2.then(function (result1) {
						App.Helper.SetValueOfLookup(executionContext, entity.parent.customer, result._app_customer_value, result1.name, entity.account.entityName);

					});

					const retrievedRecord3 = App.Helper.RetrieveRecord(entity.contact.entityName, result._app_customer_value, queryOption.queryOnloadCustomerContact);
					retrievedRecord3.then(function (result1) {
						App.Helper.SetValueOfLookup(executionContext, entity.parent.customer, result._app_customer_value, (result1.firstname + result1.lastname), entity.contact.entityName);
					});

					
				});
				
				
				App.Helper.SetFormNotificationInformation(executionContext, message.formSettingToParent, value.info, value.infoId, 10);
				
				
			}
			return executionContext;
		};

		//onchange
		const function2 = (executionContext) => {
			//const formContext = executionContext.getFormContext();

			const dateFieldValue = App.Helper.GetValue(executionContext, entity.parent.dateTime);
			
			const year = dateFieldValue.getFullYear() + "";
			const month = (dateFieldValue.getMonth() + 1) + "";
			const day = dateFieldValue.getDate() + "";
			const dateFormat = year + "-" + month + "-" + day;

			const textString = App.Helper.GetValue(executionContext, entity.parent.text);
				

			const textSetting = textString + " - " + dateFormat;
			App.Helper.SetValue(executionContext, entity.parent.name, textSetting);
			return executionContext;
		};

		//onsave
		const function3 = (executionContext) => {
			//let formContext = executionContext.getFormContext();


			let dateCondition = false;
			const date = App.Helper.GetValue(executionContext, entity.parent.dateTime);
			const dateFieldValue = Date.parse(date);
			const dateData = Date.now();

			
			if (dateData < dateFieldValue) {
				
				App.Helper.SetNotification(executionContext, entity.parent.dateTime, message.dateCannotLarger, value.errorDateid);
				//App.Helper.AddOnChange(executionContext, entity.parent.dateTime);
				App.Helper.GetFormContext(executionContext).getAttribute(entity.parent.dateTime).addOnChange(timeChange);
				

			}
			else {
				dateCondition = true;
			}

			function timeChange(executionContext) {
				App.Helper.ClearNotification(executionContext, entity.parent.dateTime, value.errorDateid);
			}

			//duplicate record
			
			if (Boolean(dateCondition) && App.Helper.IsFormTypeCreate(executionContext)) {
				const textField = App.Helper.GetValue(executionContext, entity.parent.text);
				const optionField = App.Helper.GetValue(executionContext, entity.parent.optionSet);
				const multiOptionField = App.Helper.GetValue(executionContext, entity.parent.multiOptionSet);
				const accountsData = `/${App.Helper.GetEntityTypeOfLookup(executionContext, entity.parent.lookUp)}s(${App.Helper.GetIdOfLookup(executionContext, entity.parent.lookUp)})`;

				const customerData = `/${App.Helper.GetEntityTypeOfLookup(executionContext, entity.parent.customer)}s(${App.Helper.GetIdOfLookup(executionContext, entity.parent.customer)})`;

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
				
				const nameField = textField + " - " + dateFormat;

				if (App.Helper.GetEntityTypeOfLookup(executionContext, entity.parent.customer) === entity.account.entityName) {
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
					App.Helper.CreateRecord(entity.parent.entityName, data);

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
					App.Helper.CreateRecord(entity.parent.entityName, data);
					
				}

			}

			
			//Update Child record
			if (App.Helper.IsDirtyAttribute(executionContext, entity.parent.dateTime) && App.Helper.IsFormTypeUpdate(executionContext)) {
				const idUpdate = App.Helper.GetEntityId(executionContext); 
				const queryMultipleChildRecord = `${queryOption.queryUpdateChild} eq ${idUpdate} `;
				const dateData1 = new Date(App.Helper.GetValue(executionContext, entity.parent.dateTime));

				const data =
				{
					"app_datetime": dateData1

				};

				const multipleChildRecord = App.Helper.RetrieveMultipleRecords(entity.child.entityName, queryMultipleChildRecord, 10);

				multipleChildRecord.then(function (result) {
					for (let i = 0; i < result.entities.length; i++) {
						//console.log(result.entities[i]);

						App.Helper.UpdateRecord(entity.child.entityName, result.entities[i].app_childid, data);
						
					}
				});			
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



