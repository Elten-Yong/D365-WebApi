var App = App || {};
App.Pana2 = App.Pana2 || {};
App.Pana2.AppEntity = (() => {
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
			queryChildOnchange: "?$select=app_datetime"

		},
		value = {
			recordGuid: "1f133433-354c-ec11-8f8e-002248166511",


		};

	//onchange
	const Module1 = (() => {
		// Function

		const function1 = (executionContext) => {
			

			const lookupField = App.Helper.GetValueOfLookup(executionContext, entity.child.lookUp);
			console.log(lookupField);
			if (lookupField) {
				const id = App.Helper.GetIdOfLookup(executionContext, entity.child.lookUp);

				const retrievedRecord1 = App.Helper.RetrieveRecord(entity.parent.entityName, id, queryOption.queryChildOnchange);
				retrievedRecord1.then(function (result) {
					const datetimeGet = result.app_datetime;
					const datetime = new Date(datetimeGet);
					
					App.Helper.SetValue(executionContext, entity.child.dateTime, datetime);
				});

				

			} else {
				
				App.Helper.SetValue(executionContext, entity.child.dateTime, null);
			}

		};

		// Public
		return {
			Function1: function1
		};
	})();

	const fieldOnChangeChild = (executionContext) => {
		Module1.Function1(executionContext);
	};

	return {

		FieldOnChangeChild: fieldOnChangeChild,

	};

})();



