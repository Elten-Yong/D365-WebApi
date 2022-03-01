var App = App || {};
App.Pana1 = App.Pana1 || {};
App.Pana1.AppEntity.RibbonParent = (() => {
	const
		entity = {
			parent: {
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
			}
		};

	const dateTimeToToday = (executionContext) => {
		const today = new Date();
		const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
		App.Helper.SetValue(executionContext, entity.parent.dateTime, new Date(date));
		const textField = App.Helper.GetValue(executionContext, entity.parent.text);
		App.Helper.SetValue(executionContext, entity.parent.name, (textField + " - " +date));

	};

	return {
		DateTimeToToday: dateTimeToToday
	};
})();

