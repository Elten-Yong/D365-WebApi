function DisplayAlert(e) {
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