var App = App || {};
App.Common = (() => {
    "use strict";

    const
        message = {
            callbackConsoleMesage: "[{0}] Pending callback list: {1}",
            pendingCallback: "API callback in progress, please try again later."
        },
        variable = {
            objectString: "[object String]"
        };

    let pendingCallbackList = [];

    // #region Common
    const error = (obj) => {
        console.error({ "Applicate Error": jsonParse(JSON.stringify(obj)) });
    };

    const isString = (str) => {
        return Object.prototype.toString.call(str) === variable.objectString;
    };

    const log = (obj) => {
        console.log({ "Applicate Log": jsonParse(JSON.stringify(obj)) });
    };

    const pendingCallbackHandler = (executionContext) => {
        // place these at the begining of formOnSave function
        // to avoid saving if there is any pending callback
        if (pendingCallbackList.length) {
            log(message.callbackConsoleMesage.replace("{0}", Date()).replace("{1}", pendingCallbackList.toString()));
            App.Helper.OpenAlertDialog(message.pendingCallback);
            executionContext.getEventArgs().preventDefault();
            return true;
        }

        return false;
    };

    const jsonParse = (json) => {
        // This function cannot be optimised, it's best to
        // keep it small!
        let parsed;

        try {
            parsed = JSON.parse(json);
        } catch (e) {
            // Oh well, but whatever...
        }

        return parsed; // Could be undefined!
    };

    // #endregion

    return {
        Error: error,
        IsString: isString,
        JsonParse: jsonParse,
        Log: log,
        PendingCallbackHandler: pendingCallbackHandler,
        PendingCallbackList: pendingCallbackList
    };
})();

App.Helper = (() => {
    "use strict";

    const
        action = {
            appCheckIfUserInRole: "app_CheckIfUserInRole"
        },
        booleanOperator = {
            or: "or"
        },
        comparisonOperator = {
            equal: "eq"
        },
        entity = {
            role: "role"
        },
        field = {
            role_Name: "name",
            role_PrimaryKey: "roleid"
        },
        message = {
            errorTitle: "Process(Action) Error",
            missingAttribute: "Missing attribute: ",
            missingArg: "Missing arg",
            missingExecutionContext: "Missing execution context",
            missingFieldName: "Missing field name",
            missingFormContext: "Missing form context",
            missingGridContext: "Missing grid context",
            missingId: "Missing id",
            missingIdNameEntityType: "Missing id or name or entityType: ",
            missingKey: "Missing key",
            missingName: "Missing name",
            missingRequiredLevel: "Missing required level",
            missingSubmitMode: "Missing submit mode",
            missingTabObj: "Missing tab obj: ",
            missingUserPrivilege: "Missing user privilege",
            missingValue: "Missing value",
            notOptionSet: " : Attribute Type is not option set",
            retrieveRoleNameError: "Error occurred while retrieving role name.",
            supportedOnlyBoolOptionSets: "This method only supported for attribute type(s): boolean, optionset & multiselectoptionset",
            supportedOnlyLookup: "This method only supported for attribute type(s): lookup",
            supportedOnlyNumber: "This method only supported for attribute type(s): decimal, integer, double & money",
            supportedOnlyOptions: "This method only supported for attribute type(s): optionset & multiselectoptionset",
            supportedOnlyString: "This method only supported for attribute type(s): string & memo",
            supportedParamString: "This parameter ({0}) accepts only string.",
            unknownExecutionContext: "Unknown execution context"
        },
        queryOption = {
            queryRole: `?$select=${field.role_Name}&$filter={0}`
        },
        sdkValue = {
            // Attribute Type
            attributeTypeBoolean: "boolean",
            attributeTypeDateTime: "datetime",
            attributeTypeDecimal: "decimal",
            attributeTypeDouble: "double",
            attributeTypeInteger: "integer",
            attributeTypeLookup: "lookup",
            attributeTypeMemo: "memo",
            attributeTypeMoney: "money",
            attributeTypeMultiSelectOptionSet: "multiselectoptionset",
            attributeTypeOptionSet: "optionset",
            attributeTypeString: "string",

            // Format
            formatDate: "date",
            formatDateTime: "datetime",
            formatDuration: "duration",
            formatEmail: "email",
            formatLanguage: "language",
            formatNone: "none",
            formatPhone: "phone",
            formatText: "text",
            formatTextarea: "textarea",

            formatTicketSymbol: "tickersymbol",
            formatTimeZone: "timezone",
            formatURL: "url",

            // Required Level
            requiredLevelNone: "none",
            requiredLevelRecommended: "recommended",
            requiredLevelRequired: "required",

            // Submit Mode
            submitModeAlways: "always",
            submitModeDirty: "dirty",
            submitModeNever: "never",

            // Save Mode
            saveModeSave: 1,
            saveModeSaveAndClose: 2,
            saveModeDeactivate: 5,
            saveModeReactivate: 6,
            saveModeSend: 7,
            saveModeDisqualify: 15,
            saveModeQualify: 16,
            saveModeAssign: 47,
            saveModeSaveAsCompleted: 58,
            saveModeSaveAndNew: 59,
            saveModeAutoSave: 70,

            // Form Type
            formTypeUndefined: 0,
            formTypeCreate: 1,
            formTypeUpdate: 2,
            formTypeReadOnly: 3,
            formTypeDisabled: 4,
            formTypeBulkEdit: 6,

            // Notification Level
            notificationLevelError: "ERROR",
            notificationLevelInfo: "INFO",
            notificationLevelRecommendation: "RECOMMENDATION",
            notificationLevelWarning: "WARNING",

            // Tab Display State
            tabDisplayStateCollapsed: "collapsed",
            tabDisplayStateExpanded: "expanded",

            // Operation Type
            operationType_Action: 0,
            operationType_Function: 1,
            operationType_Crud: 2,

            // CRUD Operation Name
            operationName_Create: "Create",
            operationName_Retrieve: "Retrieve",
            operationName_Update: "Update",
            operationName_Delete: "Delete",

            // Bound Parameter
            boundParameter_CrudRequest: undefined,
            boundParameter_EntityBoundActionFunction: "entity",
            boundParameter_UnboundActionFunction: null,

            // Type Name
            typeName_Boolean: "Edm.Boolean",
            typeName_DateTime: "Edm.DateTimeOffset",
            typeName_Decimal: "Edm.Decimal",
            typeName_Guid: "Edm.Guid",
            typeName_Int: "Edm.Int32",
            typeName_String: "Edm.String",

            // Structural Property
            structuralProperty_Unknown: 0,
            structuralProperty_PrimitiveType: 1,
            structuralProperty_ComplexType: 3,
            structuralProperty_EnumerationType: 4,
            structuralProperty_Collection: 5,
            structuralProperty_EntityType: 6,

            // Save option
            saveOption_SaveAndClose: "saveandclose",
            saveOption_SaveAndNew: "saveandnew"
        },
        webApiFunction = {
            whoAmI: "WhoAmI"
        },
        variable = {
            objectString: "[object String]",
            ok: "OK",
            yes: "Yes",
            no: "No",
            undefined: "undefined"
        };

    // #region Execution Context
    const getFormContext = (executionContext) => {
        if (!executionContext) {
            App.Common.Log(message.missingExecutionContext);
            return;
        }
        if (executionContext.context)
            return executionContext;
        if (!executionContext.getFormContext) {
            App.Common.Log(message.unknownExecutionContext);
            return;
        }
        return executionContext.getFormContext();
    };

    const getSharedVariable = (executionContext, key) => {
        if (!executionContext) {
            App.Common.Log(message.missingExecutionContext);
            return;
        }
        if (!key) {
            App.Common.Log(message.missingKey);
            return;
        }
        return executionContext.getSharedVariable(key);
    };

    const setSharedVariable = (executionContext, key, value) => {
        if (!executionContext) {
            App.Common.Log(message.missingExecutionContext);
            return;
        }
        if (!key) {
            App.Common.Log(message.missingKey);
            return;
        }
        if (typeof value === variable.undefined) {
            App.Common.Log(message.missingValue);
            return;
        }
        return executionContext.setSharedVariable(key, value);
    };
    // #endregion

    // #region Save Event Arguments
    const getSaveMode = (executionContext) => {
        if (!executionContext) {
            App.Common.Log(message.missingExecutionContext);
            return;
        }
        return executionContext.getEventArgs().getSaveMode();
    };

    const isSaveModeSave = (executionContext) => {
        return getSaveMode(executionContext) === sdkValue.saveModeSave;
    };

    const isSaveModeSaveAndClose = (executionContext) => {
        return getSaveMode(executionContext) === sdkValue.saveModeSaveAndClose;
    };

    const isSaveModeDeactivate = (executionContext) => {
        return getSaveMode(executionContext) === sdkValue.saveModeDeactivate;
    };

    const isSaveModeReactivate = (executionContext) => {
        return getSaveMode(executionContext) === sdkValue.saveModeReactivate;
    };

    const isSaveModeSend = (executionContext) => {
        return getSaveMode(executionContext) === sdkValue.saveModeSend;
    };

    const isSaveModeDisqualify = (executionContext) => {
        return getSaveMode(executionContext) === sdkValue.saveModeDisqualify;
    };

    const isSaveModeQualify = (executionContext) => {
        return getSaveMode(executionContext) === sdkValue.saveModeQualify;
    };

    const isSaveModeAssign = (executionContext) => {
        return getSaveMode(executionContext) === sdkValue.saveModeAssign;
    };

    const isSaveModeSaveAsCompleted = (executionContext) => {
        return getSaveMode(executionContext) === sdkValue.saveModeSaveAsCompleted;
    };

    const isSaveModeSaveAndNew = (executionContext) => {
        return getSaveMode(executionContext) === sdkValue.saveModeSaveAndNew;
    };

    const isSaveModeAutoSave = (executionContext) => {
        return getSaveMode(executionContext) === sdkValue.saveModeAutoSave;
    };
    // #endregion

    // #region Attributes
    const getAttribute = (executionContext, fieldName) => {
        const formContext = getFormContext(executionContext);
        if (!formContext) {
            App.Common.Log(message.missingFormContext);
            return;
        }
        if (!fieldName) {
            App.Common.Log(message.missingFieldName);
            return;
        }
        return formContext.getAttribute(fieldName);
    };

    const addOnChange = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        return attribute.addOnChange();
    };

    const fireOnChange = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        return attribute.fireOnChange();
    };

    const getAttributeType = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        return attribute.getAttributeType();
    };

    const isAttributeTypeBoolean = (executionContext, fieldName) => {
        const attributeType = getAttributeType(executionContext, fieldName);
        return attributeType === sdkValue.attributeTypeBoolean;
    };

    const isAttributeTypeDateTime = (executionContext, fieldName) => {
        const attributeType = getAttributeType(executionContext, fieldName);
        return attributeType === sdkValue.attributeTypeDateTime;
    };

    const isAttributeTypeDecimal = (executionContext, fieldName) => {
        const attributeType = getAttributeType(executionContext, fieldName);
        return attributeType === sdkValue.attributeTypeDecimal;
    };

    const isAttributeTypeDouble = (executionContext, fieldName) => {
        const attributeType = getAttributeType(executionContext, fieldName);
        return attributeType === sdkValue.attributeTypeDouble;
    };

    const isAttributeTypeInteger = (executionContext, fieldName) => {
        const attributeType = getAttributeType(executionContext, fieldName);
        return attributeType === sdkValue.attributeTypeInteger;
    };

    const isAttributeTypeLookup = (executionContext, fieldName) => {
        const attributeType = getAttributeType(executionContext, fieldName);
        return attributeType === sdkValue.attributeTypeLookup;
    };

    const isAttributeTypeMemo = (executionContext, fieldName) => {
        const attributeType = getAttributeType(executionContext, fieldName);
        return attributeType === sdkValue.attributeTypeMemo;
    };

    const isAttributeTypeMoney = (executionContext, fieldName) => {
        const attributeType = getAttributeType(executionContext, fieldName);
        return attributeType === sdkValue.attributeTypeMoney;
    };

    const isAttributeTypeMultiOptionSet = (executionContext, fieldName) => {
        const attributeType = getAttributeType(executionContext, fieldName);
        return attributeType === sdkValue.attributeTypeMultiSelectOptionSet;
    };

    const isAttributeTypeOptionSet = (executionContext, fieldName) => {
        const attributeType = getAttributeType(executionContext, fieldName);
        return attributeType === sdkValue.attributeTypeOptionSet;
    };

    const isAttributeTypeString = (executionContext, fieldName) => {
        const attributeType = getAttributeType(executionContext, fieldName);
        return attributeType === sdkValue.attributeTypeString;
    };

    const getFormat = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        return attribute.getFormat();
    };

    const isFormatDate = (executionContext, fieldName) => {
        const attributeFormat = getFormat(executionContext, fieldName);
        return attributeFormat === sdkValue.formatDate;
    };

    const isFormatDateTime = (executionContext, fieldName) => {
        const attributeFormat = getFormat(executionContext, fieldName);
        return attributeFormat === sdkValue.formatDateTime;
    };

    const isFormatDuration = (executionContext, fieldName) => {
        const attributeFormat = getFormat(executionContext, fieldName);
        return attributeFormat === sdkValue.formatDuration;
    };

    const isFormatEmail = (executionContext, fieldName) => {
        const attributeFormat = getFormat(executionContext, fieldName);
        return attributeFormat === sdkValue.formatEmail;
    };

    const isFormatLanguage = (executionContext, fieldName) => {
        const attributeFormat = getFormat(executionContext, fieldName);
        return attributeFormat === sdkValue.formatLanguage;
    };

    const isFormatNone = (executionContext, fieldName) => {
        const attributeFormat = getFormat(executionContext, fieldName);
        return attributeFormat === sdkValue.formatNone;
    };

    const isFormatPhone = (executionContext, fieldName) => {
        const attributeFormat = getFormat(executionContext, fieldName);
        return attributeFormat === sdkValue.formatPhone;
    };

    const isFormatText = (executionContext, fieldName) => {
        const attributeFormat = getFormat(executionContext, fieldName);
        return attributeFormat === sdkValue.formatText;
    };

    const isFormatTextarea = (executionContext, fieldName) => {
        const attributeFormat = getFormat(executionContext, fieldName);
        return attributeFormat === sdkValue.formatTextarea;
    };

    const isFormatTickerSymbol = (executionContext, fieldName) => {
        const attributeFormat = getFormat(executionContext, fieldName);
        return attributeFormat === sdkValue.formatTicketSymbol;
    };

    const isFormatTimeZone = (executionContext, fieldName) => {
        const attributeFormat = getFormat(executionContext, fieldName);
        return attributeFormat === sdkValue.formatTimeZone;
    };

    const isFormatUrl = (executionContext, fieldName) => {
        const attributeFormat = getFormat(executionContext, fieldName);
        return attributeFormat === sdkValue.formatURL;
    };

    // Attribute Types Supported - Boolean, OptionSet, MultiSelectOptionSet
    const getInitialValue = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        const attributeType = getAttributeType(executionContext, fieldName);
        if (attributeType !== sdkValue.attributeTypeBoolean && attributeType !== sdkValue.attributeTypeOptionSet && attributeType !== sdkValue.attributeTypeMultiSelectOptionSet) {
            App.Common.Log(message.supportedOnlyBoolOptionSets);
            return;
        }
        return attribute.getInitialValue();
    };

    const isDirtyAttribute = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        return attribute.getIsDirty();
    };

    // Attribute Types Supported - Lookup
    const isPartyList = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        const attributeType = getAttributeType(executionContext, fieldName);
        if (attributeType !== sdkValue.attributeTypeLookup) {
            App.Common.Log(message.supportedOnlyLookup);
            return;
        }
        return attribute.getIsPartyList();
    };

    // Attribute types supported - decimal, integer, double, money
    const getMax = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        const attributeType = getAttributeType(executionContext, fieldName);
        if (attributeType !== sdkValue.attributeTypeDecimal && attributeType !== sdkValue.attributeTypeInteger && attributeType !== sdkValue.attributeTypeDouble && attributeType !== sdkValue.attributeTypeMoney) {
            App.Common.Log(message.supportedOnlyNumber);
            return;
        }
        return attribute.getMax();
    };

    // Attribute types supported - string, memo
    const getMaxLength = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        const attributeType = getAttributeType(executionContext, fieldName);
        if (attributeType !== sdkValue.attributeTypeString && attributeType !== sdkValue.attributeTypeMemo) {
            App.Common.Log(message.supportedOnlyString);
            return;
        }
        return attribute.getMaxLength();
    };

    // Attribute types supported - Decimal, integer, double, money
    const getMin = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        const attributeType = getAttributeType(executionContext, fieldName);
        if (attributeType !== sdkValue.attributeTypeDecimal && attributeType !== sdkValue.attributeTypeInteger && attributeType !== sdkValue.attributeTypeDouble && attributeType !== sdkValue.attributeTypeMoney) {
            App.Common.Log(message.supportedOnlyNumber);
            return;
        }
        return attribute.getMin();
    };

    const getAttributeName = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        return attribute.getName();
    };

    // Attribute types supported - OptionSet, MultiSelectOptionSet
    const getOption = (executionContext, fieldName, value) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        if (typeof value === variable.undefined) {
            App.Common.Log(message.missingValue);
            return;
        }
        const attributeType = getAttributeType(executionContext, fieldName);
        if (attributeType !== sdkValue.attributeTypeOptionSet && attributeType !== sdkValue.attributeTypeMultiSelectOptionSet) {
            App.Common.Log(message.supportedOnlyOptions);
            return;
        }
        return attribute.getOption(value);
    };

    // Attribute types supported - OptionSet, MultiSelectOptionSet
    const getOptions = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        const attributeType = getAttributeType(executionContext, fieldName);
        if (attributeType !== sdkValue.attributeTypeOptionSet && attributeType !== sdkValue.attributeTypeMultiSelectOptionSet) {
            App.Common.Log(message.supportedOnlyOptions);
            return;
        }
        return attribute.getOptions();
    };

    // Attribute types supported - Money, decimal, double, and integer
    const getPrecision = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        const attributeType = getAttributeType(executionContext, fieldName);
        if (attributeType !== sdkValue.attributeTypeDecimal && attributeType !== sdkValue.attributeTypeInteger && attributeType !== sdkValue.attributeTypeDouble && attributeType !== sdkValue.attributeTypeMoney) {
            App.Common.Log(message.supportedOnlyNumber);
            return;
        }
        return attribute.getPrecision();
    };

    const getRequiredLevel = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        return attribute.getRequiredLevel();
    };

    const isRequiredLevelNone = (executionContext, fieldName) => {
        const requiredLevel = getRequiredLevel(executionContext, fieldName);
        return requiredLevel === sdkValue.requiredLevelNone;
    };

    const isRequiredLevelRequired = (executionContext, fieldName) => {
        const requiredLevel = getRequiredLevel(executionContext, fieldName);
        return requiredLevel === sdkValue.requiredLevelRequired;
    };

    const isRequiredLevelRecommended = (executionContext, fieldName) => {
        const requiredLevel = getRequiredLevel(executionContext, fieldName);
        return requiredLevel === sdkValue.requiredLevelRecommended;
    };

    // Attribute types supported - optionset, multiselectoptionset
    const getSelectedOption = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        const attributeType = getAttributeType(executionContext, fieldName);
        if (attributeType !== sdkValue.attributeTypeOptionSet && attributeType !== sdkValue.attributeTypeMultiSelectOptionSet) {
            App.Common.Log(message.supportedOnlyOptions);
            return;
        }
        return attribute.getSelectedOption();
    };

    const getSubmitMode = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        return attribute.getSubmitMode();
    };

    const isSubmitModeAlways = (executionContext, fieldName) => {
        const submitMode = getSubmitMode(executionContext, fieldName);
        return submitMode === sdkValue.submitModeAlways;
    };

    const isSubmitModeNever = (executionContext, fieldName) => {
        const submitMode = getSubmitMode(executionContext, fieldName);
        return submitMode === sdkValue.submitModeNever;
    };

    const isSubmitModeDirty = (executionContext, fieldName) => {
        const submitMode = getSubmitMode(executionContext, fieldName);
        return submitMode === sdkValue.submitModeDirty;
    };

    // Attribute types supported - optionset, multiselectoptionset
    const getText = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        const attributeType = getAttributeType(executionContext, fieldName);
        if (attributeType !== sdkValue.attributeTypeOptionSet && attributeType !== sdkValue.attributeTypeMultiSelectOptionSet) {
            App.Common.Log(message.supportedOnlyOptions);
            return;
        }
        return attribute.getText();
    };

    const getUserPrivilege = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        return attribute.getUserPrivilege();
    };

    const canRead = (executionContext, fieldName) => {
        const userPrivilege = getUserPrivilege(executionContext, fieldName);
        if (!userPrivilege) {
            App.Common.Log(message.missingUserPrivilege + fieldName);
            return;
        }
        return userPrivilege.canRead;
    };

    const canUpdate = (executionContext, fieldName) => {
        const userPrivilege = getUserPrivilege(executionContext, fieldName);
        if (!userPrivilege) {
            App.Common.Log(message.missingUserPrivilege + fieldName);
            return;
        }
        return userPrivilege.canUpdate;
    };

    const canCreate = (executionContext, fieldName) => {
        const userPrivilege = getUserPrivilege(executionContext, fieldName);
        if (!userPrivilege) {
            App.Common.Log(message.missingUserPrivilege + fieldName);
            return;
        }
        return userPrivilege.canCreate;
    };

    const getValue = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        return attribute.getValue();
    };

    // Attribute types supported - Lookup
    const getValueOfLookup = (executionContext, fieldName) => {
        const value = getValue(executionContext, fieldName);
        if (typeof value === variable.undefined) {
            App.Common.Log(`${message.missingValue} ${fieldName}`);
            return;
        }
        const attributeType = getAttributeType(executionContext, fieldName);
        if (attributeType !== sdkValue.attributeTypeLookup) {
            App.Common.Log(message.supportedOnlyLookup);
            return;
        }
        return value ? value[0] : null;
    };

    // Attribute types supported - Lookup
    const getEntityTypeOfLookup = (executionContext, fieldName) => {
        const valueOfLookup = getValueOfLookup(executionContext, fieldName);
        return valueOfLookup ? valueOfLookup.entityType : null;
    };

    // Attribute types supported - Lookup
    const getIdOfLookup = (executionContext, fieldName) => {
        const valueOfLookup = getValueOfLookup(executionContext, fieldName);
        return valueOfLookup ? valueOfLookup.id.replace("{", "").replace("}", "") : null;
    };

    // Attribute types supported - Lookup
    const getNameOfLookup = (executionContext, fieldName) => {
        const valueOfLookup = getValueOfLookup(executionContext, fieldName);
        return valueOfLookup ? valueOfLookup.name : null;
    };

    const isValidAttribute = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        return attribute.isValid();
    };

    // Attribute types supported - Money, decimal, double, and integer
    const setPrecision = (executionContext, fieldName, value) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        if (typeof value === variable.undefined) {
            App.Common.Log(message.missingValue);
            return;
        }
        const attributeType = getAttributeType(executionContext, fieldName);
        if (attributeType !== sdkValue.attributeTypeDecimal && attributeType !== sdkValue.attributeTypeInteger && attributeType !== sdkValue.attributeTypeDouble && attributeType !== sdkValue.attributeTypeMoney) {
            App.Common.Log(message.supportedOnlyNumber);
            return;
        }
        attribute.setPrecision(value);
    };

    const setRequiredLevel = (executionContext, fieldName, requiredLevel) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        if (!requiredLevel) {
            App.Common.Log(message.missingRequiredLevel);
            return;
        }
        attribute.setRequiredLevel(requiredLevel);
    };

    const setRequiredLevelToNone = (executionContext, fieldName) => {
        setRequiredLevel(executionContext, fieldName, sdkValue.requiredLevelNone);
    };

    const setRequiredLevelToRecommended = (executionContext, fieldName) => {
        setRequiredLevel(executionContext, fieldName, sdkValue.requiredLevelRecommended);
    };

    const setRequiredLevelToRequired = (executionContext, fieldName) => {
        setRequiredLevel(executionContext, fieldName, sdkValue.requiredLevelRequired);
    };

    const setSubmitMode = (executionContext, fieldName, submitMode) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        if (!submitMode) {
            App.Common.Log(message.missingSubmitMode);
            return;
        }
        attribute.setSubmitMode(submitMode);
    };

    const setSubmitModeToAlways = (executionContext, fieldName) => {
        setSubmitMode(executionContext, fieldName, sdkValue.submitModeAlways);
    };

    const setSubmitModeToNever = (executionContext, fieldName) => {
        setSubmitMode(executionContext, fieldName, sdkValue.submitModeNever);
    };

    const setSubmitModeToDirty = (executionContext, fieldName) => {
        setSubmitMode(executionContext, fieldName, sdkValue.submitModeDirty);
    };

    const setValue = (executionContext, fieldName, value) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        if (typeof value === variable.undefined) {
            App.Common.Log(message.missingValue);
            return;
        }
        attribute.setValue(value);
    };

    const setValueOfLookup = (executionContext, fieldName, id, name, entityType) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        if (!id) {
            App.Common.Log(message.missingId);
            return;
        }
        if (!name) {
            App.Common.Log(message.missingName);
            return;
        }
        if (!App.Common.IsString(id) || !App.Common.IsString(name) || !App.Common.IsString(entityType)) {
            App.Common.Log(message.missingIdNameEntityType + fieldName);
            return;
        }

        //Special Handling for CRM Turbo Form
        id = id.toUpperCase();
        if (id.charAt(0) !== "{" && id.charAt(id.length - 1) !== "}") {
            id = "{" + id + "}";
        }
        attribute.setValue([{ id: id, name: name, entityType: entityType }]);
    };

    const removeValue = (executionContext, fieldName) => {
        const attribute = getAttribute(executionContext, fieldName);
        if (!attribute) {
            App.Common.Log(message.missingAttribute + fieldName);
            return;
        }
        attribute.setValue(null);
    };

    const hasValue = (executionContext, fieldName) => {
        const value = getValue(executionContext, fieldName);
        return value ? true : false;
    };
    // #endregion

    // #region Controls
    const getControl = (executionContext, fieldName) => {
        const formContext = getFormContext(executionContext);
        if (!formContext) {
            App.Common.Log(message.missingFormContext);
            return;
        }
        if (!fieldName) {
            App.Common.Log(message.missingFieldName);
            return;
        }
        return formContext.getControl(fieldName);
    };

    const addNotification = (executionContext, fieldName, notification) => {
        const control = getControl(executionContext, fieldName);
        return control ? control.addNotification(notification) : false;
    };

    const addNotificationError = (executionContext, fieldName, notificationMessage, uniqueId) => {
        const control = getControl(executionContext, fieldName);
        const notification = {
            messages: [notificationMessage],
            notificationLevel: sdkValue.notificationLevelError
        };
        if (uniqueId) {
            notification.uniqueId = uniqueId;
        }
        return control ? control.addNotification(notification) : false;
    };

    const addNotificationRecommendation = (executionContext, fieldName, notificationMessage, uniqueId) => {
        const control = getControl(executionContext, fieldName);
        const notification = {
            messages: [notificationMessage],
            notificationLevel: sdkValue.notificationLevelRecommendation
        };
        if (uniqueId) {
            notification.uniqueId = uniqueId;
        }
        return control ? control.addNotification(notification) : false;
    };

    const setNotification = (executionContext, fieldName, errorMessage, uniqueId) => {
        const control = getControl(executionContext, fieldName);
        return control ? control.setNotification(errorMessage, uniqueId) : false;
    };

    //Control types supported - OptionSet, MultiSelectOptionSet
    const addOption = (executionContext, fieldName, option, index) => {
        const control = getControl(executionContext, fieldName);
        if (control) {
            const attributeType = getAttributeType(executionContext, fieldName);
            if (attributeType !== sdkValue.attributeTypeOptionSet) {
                App.Common.Log(fieldName + message.notOptionSet);
                return;
            }
            control.addOption(option, index);
        }
    };

    const clearNotification = (executionContext, fieldName, uniqueId) => {
        const control = getControl(executionContext, fieldName);
        return control ? control.clearNotification(uniqueId) : false;
    };

    //Control types supported - OptionSet, MultiSelectOptionSet
    const clearOptions = (executionContext, fieldName) => {
        const control = getControl(executionContext, fieldName);
        if (control) {
            const attributeType = getAttributeType(executionContext, fieldName);
            if (attributeType !== sdkValue.attributeTypeOptionSet) {
                App.Common.Log(fieldName + message.notOptionSet);
                return;
            }
            control.clearOptions();
        }
    };

    const getFieldDisabled = (executionContext, fieldName) => {
        const control = getControl(executionContext, fieldName);
        return control ? control.getDisabled() : false;
    };

    const isFieldDisabled = (executionContext, fieldName) => {
        return getFieldDisabled(executionContext, fieldName) === true;
    };

    const isFieldEnabled = (executionContext, fieldName) => {
        return getFieldDisabled(executionContext, fieldName) === false;
    };

    const setFieldDisabled = (executionContext, fieldName, disable) => {
        const control = getControl(executionContext, fieldName);

        if (control) {
            control.setDisabled(disable);
        }
    };

    const disabledField = (executionContext, fieldName) => {
        setFieldDisabled(executionContext, fieldName, true);
    };

    const enabledField = (executionContext, fieldName) => {
        setFieldDisabled(executionContext, fieldName, false);
    };

    const disabledSection = (executionContext, argTab, argSection) => {
        var section = getSectionObj(executionContext, argTab, argSection);
        if (!section) {
            App.Common.Log(message.missingTabObj);
            return;
        }
        section.controls.forEach((control) => { control.setDisabled(true); });
    };

    const disabledForm = (executionContext) => {
        const formContext = getFormContext(executionContext);
        if (!formContext) {
            App.Common.Log(message.missingFormContext);
            return;
        }
        formContext.ui.controls.forEach((control) => { control.setDisabled(true); });
    };

    const getFieldVisible = (executionContext, fieldName) => {
        const control = getControl(executionContext, fieldName);
        return control ? control.getVisible() : false;
    };

    const isFieldVisible = (executionContext, fieldName) => {
        return getFieldVisible(executionContext, fieldName) === true;
    };

    const isFieldHidden = (executionContext, fieldName) => {
        return getFieldVisible(executionContext, fieldName) === false;
    };

    const setFieldVisible = (executionContext, fieldName, visible) => {
        const control = getControl(executionContext, fieldName);

        if (control) {
            control.setVisible(visible);
        }
    };

    const showField = (executionContext, fieldName) => {
        setFieldVisible(executionContext, fieldName, true);
    };

    const hideField = (executionContext, fieldName) => {
        setFieldVisible(executionContext, fieldName, false);
    };

    //Control types supported - OptionSet, MultiSelectOptionSet
    const removeOption = (executionContext, fieldName, value) => {
        const control = getControl(executionContext, fieldName);
        if (control) {
            const attributeType = getAttributeType(executionContext, fieldName);
            if (attributeType !== sdkValue.attributeTypeOptionSet) {
                App.Common.Log(fieldName + message.notOptionSet);
                return;
            }
            control.removeOption(value);
        }
    };

    const removeHeaderOption = (executionContext, fieldName, value) => {
        const control = getControl(executionContext, fieldName);
        if (control) {
            const attributeType = getAttributeType(executionContext, fieldName.replace('header_', ''));
            if (attributeType !== sdkValue.attributeTypeOptionSet) {
                App.Common.Log(fieldName + message.notOptionSet);
                return;
            }
            control.removeOption(value);
        }
    };

    const setFieldFocus = (executionContext, fieldName) => {
        const control = getControl(executionContext, fieldName);
        if (control) {
            control.setFocus();
        }
    };
    // #endregion

    // #region formContext.data
    const refreshData = (executionContext) => {
        const formContext = getFormContext(executionContext);
        if (formContext) {
            formContext.data.refresh();
        }
    };

    const refreshForm = () => {
        Xrm.Utility.openEntityForm(Xrm.Page.data.entity.getEntityName(), Xrm.Page.data.entity.getId());
    };

    // async save
    const saveData = (executionContext) => {
        const formContext = getFormContext(executionContext);
        formContext.data.save();
    };

    // sync save
    const saveAndCloseEntity = (executionContext) => {
        saveEntity(executionContext, sdkValue.saveOption_SaveAndClose);
    };

    // sync save
    const saveAndNewEntity = (executionContext) => {
        saveEntity(executionContext, sdkValue.saveOption_SaveAndNew);
    };

    // sync save
    const saveEntity = (executionContext, saveOption) => {
        const formContext = getFormContext(executionContext);
        if (saveOption)
            formContext.data.entity.save(saveOption);
        else
            formContext.data.entity.save();
    };

    const isValidEntity = (executionContext) => {
        const formContext = getFormContext(executionContext);
        return formContext.data.entity.isValid();
    };
    // #endregion

    // #region formContext.data.entity
    const getEntityName = (executionContext) => {
        const formContext = getFormContext(executionContext);

        if (formContext) {
            return formContext.data.entity.getEntityName();
        }

        return null;
    };

    const getEntityReference = (executionContext) => {
        const formContext = getFormContext(executionContext);

        if (formContext) {
            return formContext.data.entity.getEntityReference();
        }

        return null;
    };

    const getEntityId = (executionContext) => {
        const formContext = getFormContext(executionContext);

        if (formContext) {
            return formContext.data.entity.getId().replace("{", "").replace("}", "");
        }

        return null;
    };

    const isDirtyForm = (executionContext) => {
        const formContext = getFormContext(executionContext);
        return formContext ? formContext.data.entity.getIsDirty() : false;
    };
    // #endregion

    // #region formContext.ui
    const clearFormNotification = (executionContext, uniqueId) => {
        const formContext = getFormContext(executionContext);
        return formContext ? formContext.ui.clearFormNotification(uniqueId) : false;
    };

    const close = (executionContext) => {
        const formContext = getFormContext(executionContext);
        if (!formContext) {
            App.Common.Log(message.missingFormContext);
            return;
        }
        formContext.ui.close();
    };

    const getFormType = (executionContext) => {
        const formContext = getFormContext(executionContext);
        return formContext ? formContext.ui.getFormType() : null;
    };

    const isFormTypeUndefined = (executionContext) => {
        const formType = getFormType(executionContext);
        return formType === sdkValue.formTypeUndefined;
    };

    const isFormTypeCreate = (executionContext) => {
        const formType = getFormType(executionContext);
        return formType === sdkValue.formTypeCreate;
    };

    const isFormTypeUpdate = (executionContext) => {
        const formType = getFormType(executionContext);
        return formType === sdkValue.formTypeUpdate;
    };

    const isFormTypeReadOnly = (executionContext) => {
        const formType = getFormType(executionContext);
        return formType === sdkValue.formTypeReadOnly;
    };

    const isFormTypeDisabled = (executionContext) => {
        const formType = getFormType(executionContext);
        return formType === sdkValue.formTypeDisabled;
    };

    const isFormTypeBulkEdit = (executionContext) => {
        const formType = getFormType(executionContext);
        return formType === sdkValue.formTypeBulkEdit;
    };

    const refreshRibbon = (executionContext) => {
        const formContext = getFormContext(executionContext);
        if (!formContext) {
            App.Common.Log(message.missingFormContext);
            return;
        }
        formContext.ui.refreshRibbon();
    };

    const setFormEntityName = (executionContext, arg) => {
        const formContext = getFormContext(executionContext);
        if (!formContext) {
            App.Common.Log(message.missingFormContext);
            return;
        }
        formContext.ui.setFormEntityName(arg);
    };

    const setFormNotification = (executionContext, message, level, uniqueId) => {
        const formContext = getFormContext(executionContext);
        if (!formContext) {
            App.Common.Log(message.missingFormContext);
            return;
        }
        formContext.ui.setFormNotification(message, level, uniqueId);
    };

    const setFormNotificationInformation = (executionContext, message, uniqueId, showForXSeconds) => {
        setFormNotification(executionContext, message, sdkValue.notificationLevelInfo, uniqueId);
        if (Number.isInteger(showForXSeconds)) {
            setTimeout(
                () => {
                    clearFormNotification(executionContext, uniqueId);
                },
                showForXSeconds * 1000
            );
        }
    };

    const setFormNotificationWarning = (executionContext, message, uniqueId) => {
        setFormNotification(executionContext, message, sdkValue.notificationLevelWarning, uniqueId);
    };

    const setFormNotificationError = (executionContext, message, uniqueId) => {
        setFormNotification(executionContext, message, sdkValue.notificationLevelError, uniqueId);
    };
    // #endregion

    // #region formContext.ui.formSelector
    const getFormItems = (executionContext) => {
        const formContext = getFormContext(executionContext);
        if (!formContext) {
            App.Common.Log(message.missingFormContext);
            return;
        }
        return formContext.ui.formSelector.items.get();
    };

    const getFormItem = (executionContext) => {
        const formContext = getFormContext(executionContext);
        if (!formContext) {
            App.Common.Log(message.missingFormContext);
            return;
        }
        return formContext.ui.formSelector.getCurrentItem();
    };

    const getFormItemLabel = (executionContext) => {
        const formItem = getFormItem(executionContext);

        if (formItem) {
            return formItem.getLabel();
        }

        return null;
    };

    const navigate = (executionContext, arg) => {
        if (!arg) {
            return false;
        }

        // if we dont check to see if we're already on the form we'll get into an infinite loop
        if (getFormItemLabel(executionContext).toLowerCase() !== arg.toLowerCase()) {
            const formItems = getFormItems(executionContext);
            let i = formItems.length, formItem;

            while (i > 0) {
                i -= 1;
                formItem = formItems[i];
                // try to find a form based on the name
                if (formItem.getLabel().toLowerCase() === arg.toLowerCase()) {
                    formItem.navigate(); // redirect once we find it
                    return true;
                }
            }
        }

        return false;
    };
    // #endregion

    // #region formContext.ui.navigation
    const getNavigationItem = (executionContext, arg) => {
        const formContext = getFormContext(executionContext);
        if (!formContext) {
            App.Common.Log(message.missingFormContext);
            return;
        }
        if (!arg) {
            App.Common.Log(message.missingArg);
            return;
        }
        return formContext.ui.navigation.items.get(arg);
    };

    const setNavigationVisible = (executionContext, arg, visible) => {
        const navigationItem = getNavigationItem(executionContext, arg);

        if (navigationItem) {
            navigationItem.setVisible(visible);
        }

        return null;
    };

    const hideNavigation = (executionContext, arg) => {
        return setNavigationVisible(executionContext, arg, true);
    };

    const showNavigation = (executionContext, arg) => {
        return setNavigationVisible(executionContext, arg, false);
    };
    // #endregion

    // #region formcontext.ui.tabs
    const getTabObj = (executionContext, arg) => {
        const formContext = getFormContext(executionContext);
        if (!formContext) {
            App.Common.Log(message.missingFormContext);
            return;
        }
        if (!arg) {
            App.Common.Log(message.missingArg);
            return;
        }
        return formContext.ui.tabs.get(arg);
    };

    const getTabDisplayState = (executionContext, arg) => {
        const tabObj = getTabObj(executionContext, arg);
        if (!tabObj) {
            App.Common.Log(message.missingTabObj + arg);
            return;
        }
        return tabObj.getDisplayState();
    };

    const isTabCollapsed = (executionContext, arg) => {
        return getTabDisplayState(executionContext, arg) === sdkValue.tabDisplayStateCollapsed;
    };

    const isTabExpanded = (executionContext, arg) => {
        return getTabDisplayState(executionContext, arg) === sdkValue.tabDisplayStateExpanded;
    };

    const getTabVisible = (executionContext, arg) => {
        const tabObj = getTabObj(executionContext, arg);
        if (!tabObj) {
            App.Common.Log(message.missingTabObj + arg);
            return;
        }
        return tabObj.getVisible();
    };

    const isTabVisible = (executionContext, arg) => {
        return getTabVisible(executionContext, arg) === true;
    };

    const isTabHidden = (executionContext, arg) => {
        return getTabVisible(executionContext, arg) === false;
    };

    const setTabDisplayState = (executionContext, arg, state) => {
        const tabObj = getTabObj(executionContext, arg);
        if (!tabObj) {
            App.Common.Log(message.missingTabObj + arg);
            return;
        }
        tabObj.setDisplayState(state);
    };

    const collapseTab = (executionContext, arg) => {
        setTabDisplayState(executionContext, arg, sdkValue.tabDisplayStateCollapsed);
    };

    const expandTab = (executionContext, arg) => {
        setTabDisplayState(executionContext, arg, sdkValue.tabDisplayStateExpanded);
    };

    const setTabVisible = (executionContext, arg, visible) => {
        const tabObj = getTabObj(executionContext, arg);
        if (!tabObj) {
            App.Common.Log(message.missingTabObj + arg);
            return;
        }
        tabObj.setVisible(visible);
    };

    const hideTab = (executionContext, arg) => {
        setTabVisible(executionContext, arg, false);
    };

    const showTab = (executionContext, arg) => {
        setTabVisible(executionContext, arg, true);
    };
    // #endregion

    // #region formCotext.ui.sections
    const getSectionObj = (executionContext, argTab, argSection) => {
        const tabObj = getTabObj(executionContext, argTab);

        if (tabObj && argSection) {
            return tabObj.sections.get(argSection);
        }

        return null;
    };

    const setSectionVisible = (executionContext, argTab, argSection, visible) => {
        const sectionObj = getSectionObj(executionContext, argTab, argSection);

        if (sectionObj) {
            sectionObj.setVisible(visible);
        }
    };

    const hideSection = (executionContext, argTab, argSection) => {
        setSectionVisible(executionContext, argTab, argSection, false);
    };

    const showSection = (executionContext, argTab, argSection) => {
        setSectionVisible(executionContext, argTab, argSection, true);
    };
    // #endregion

    // #region GridControl
    const refreshGrid = (executionContext, gridName) => {
        const gridContext = getControl(executionContext, gridName);
        if (!gridContext) {
            App.Common.Log(message.missingGridContext);
            return;
        }
        gridContext.refresh();
    };
    // #endregion

    // #region Xrm.Navigation
    const openAlertDialog = async (text, title, customConfirmButtonLabel, customAlertOptions) => {
        const alertStrings = { confirmButtonLabel: customConfirmButtonLabel || variable.ok, text: text, title: title };
        const alertOptions = { height: 280, width: 420 };
        return await Xrm.Navigation.openAlertDialog(alertStrings, customAlertOptions || alertOptions);
    };

    const openConfirmDialog = (text, title, customConfirmButtonLabel, customCancelButtonLabel, customConfirmOptions) => {
        const confirmStrings = { confirmButtonLabel: customConfirmButtonLabel || variable.yes, cancelButtonLabel: customCancelButtonLabel || variable.no, text: text, title: title };
        const confirmOptions = { height: 280, width: 420 };
        return Xrm.Navigation.openConfirmDialog(confirmStrings, customConfirmOptions || confirmOptions);
    };
    // #endregion

    // #region Xrm.Utility
    const closeProgressIndicator = () => {
        return Xrm.Utility.closeProgressIndicator();
    };

    const getUserId = () => {
        return Xrm.Utility.getGlobalContext().userSettings.userId.replace(/[{}]/g, "");
    };

    const getUserName = () => {
        return Xrm.Utility.getGlobalContext().userSettings.userName;
    };

    const getUserRoles = () => {
        return Xrm.Utility.getGlobalContext().userSettings.securityRoles;
    };

    const getClientUrl = () => {
        return Xrm.Utility.getGlobalContext().getClientUrl();
    };

    const invokeProcessAction = async (name, parameters, progressIndicatorMessage) => {
        if (progressIndicatorMessage)
            showProgressIndicator(progressIndicatorMessage);

        return await Xrm.Utility.invokeProcessAction(name, parameters)
            .catch(error => {
                App.Common.Error(error);
                App.Helper.OpenAlertDialog(error, message.errorTitle);
                return;
            })
            .finally(() => {
                if (progressIndicatorMessage)
                    closeProgressIndicator();
            });
    };

    const showProgressIndicator = (message) => {
        return Xrm.Utility.showProgressIndicator(message);
    };
    // #endregion

    // #region Xrm.WebApi
    const createRecord = async (entityName, data) => {
        const timespan = new Date().getTime();
        App.Common.PendingCallbackList.add(timespan);
        App.Common.Log(`App.Helper.CreateRecord(${timespan}) = ${entityName}\n${data}`);
        return await Xrm.WebApi.createRecord(entityName, data)
            .catch((error) => {
                App.Common.Error(error);
            })
            .finally(() => {
                App.Common.PendingCallbackList.remove(timespan);
            });
    };

    const deleteRecord = async (entityName, id) => {
        const timespan = new Date().getTime();
        App.Common.PendingCallbackList.add(timespan);
        App.Common.Log(`App.Helper.DeleteRecord(${timespan}) = ${entityName}(id: ${id})`);
        return await Xrm.WebApi.deleteRecord(entityName, id)
            .catch((error) => {
                App.Common.Error(error);
            })
            .finally(() => {
                App.Common.PendingCallbackList.remove(timespan);
            });
    };

    const retrieveRecord = async (entityName, id, options) => {
        const timespan = new Date().getTime();
        App.Common.PendingCallbackList.add(timespan);
        App.Common.Log(`App.Helper.RetrieveRecord(${timespan}) = ${entityName}(id: ${id})\n${options}`);
        return await Xrm.WebApi.retrieveRecord(entityName, id, options)
            .catch((error) => {
                App.Common.Error(error);
            })
            .finally(() => {
                App.Common.PendingCallbackList.remove(timespan);
            });
    };

    const retrieveMultipleRecords = async (entityName, options, maxPageSize) => {
        const timespan = new Date().getTime();
        App.Common.PendingCallbackList.add(timespan);
        App.Common.Log(`App.Helper.RetrieveMultipleRecords(${timespan}) = ${entityName}(page size: ${maxPageSize})\n${options}`);
        return await Xrm.WebApi.retrieveMultipleRecords(entityName, options, maxPageSize)
            .catch((error) => {
                App.Common.Error(error);
            })
            .finally(() => {
                App.Common.PendingCallbackList.remove(timespan);
            });
    };

    const updateRecord = async (entityName, id, data) => {
        const timespan = new Date().getTime();
        App.Common.PendingCallbackList.add(timespan);
        App.Common.Log(`App.Helper.UpdateRecord(${timespan}) = ${entityName}(id: ${id})\n${data}`);
        return await Xrm.WebApi.updateRecord(entityName, id, data)
            .catch((error) => {
                App.Common.Error(error);
            })
            .finally(() => {
                App.Common.PendingCallbackList.remove(timespan);
            });
    };

    const isAvailableOffline = (entityName) => Xrm.WebApi.offline.isAvailableOffline(entityName);

    /**
     * Class function to generate executeRequest object required to execute Action / Function / CRUD requests.
     * */
    class executeRequestGenerator {
        /**
         * Constructor to call in order to initialize the executeRequestGenerator class.
         * @param {any} boundParameter Use SdkValue > boundParameter
         * @param {number} operationType Use SdkValue > operationType
         * @param {string} operationName The name of the action/function.
         */
        constructor(boundParameter, operationType, operationName) {
            this._argsName = [];
            this._argsValue = [];

            this._boundParameter = boundParameter;
            this._parameterTypes = {};
            this._operationType = operationType;
            this._operationName = operationName;
        }
        /**
         * Add ParameterType property to executeRequestGenerator class.
         * @param {string} name Name of enumProperties
         * @param {string} type Use SdkValue > typeName (if available, else manually populate). The fully qualified name of the parameter type.
         * @param {number} structuralProperty Use SdkValue > structuralProperty. The category of the parameter type.
         * @param {any} value Value of enumProperties
         */
        addParameterType(name, type, structuralProperty, value) {
            this._argsName.push(name);
            this._argsValue.push(value);

            this._parameterTypes[name] = {
                typeName: type,
                structuralProperty: structuralProperty
            };
        }
        /**
         * Add String-typed ParameterType property to getMetadataObject.
         * @param {string} name Name of enumProperties
         * @param {string} value Value of enumProperties
         */
        addParameterType_String(name, value) {
            this.addParameterType(name, sdkValue.typeName_String, sdkValue.structuralProperty_PrimitiveType, value);
        }
        /**
         * @typedef {object} kvString String-typed key-value pair
         * @property {string} name Name of the key-value pair.
         * @property {string} value String-typed value of the key-value pair.
         */
        /**
         * Add String-typed ParameterType property to getMetadataObject.
         * @param {kvString[]} kvArray Array of string-typed key value pairs.
         */
        addParameterType_String(kvArray) {
            kvArray.forEach(kvString => {
                this.addParameterType(kvString.name, sdkValue.typeName_String, sdkValue.structuralProperty_PrimitiveType, kvString.value);
            });
        }
        /**
         * Generate the executeRequest required to perform executeRequest.
         * @returns {object} executeRequest required to perform executeRequest.
         * */
        generate() {
            const argsName = this._argsName;
            const argsValue = this._argsValue;

            const executeRequest = function () {
                if (argsName.length === 0)
                    return;

                for (const index in argsName) {
                    this[argsName[index]] = argsValue[index];
                }
            };
            executeRequest.prototype.getMetadata = () => {
                return {
                    boundParameter: this._boundParameter,
                    parameterTypes: this._parameterTypes,
                    operationType: this._operationType,
                    operationName: this._operationName
                };
            };
            return new executeRequest();
        }
    }

    const execute = async (request) => {
        const timespan = new Date().getTime();
        App.Common.PendingCallbackList.add(timespan);
        App.Common.Log(`App.Helper.Execute(${timespan})\n${request.getMetadata().operationName}`);
        return await Xrm.WebApi.online.execute(request)
            .catch((error) => {
                App.Common.Error(error);
            })
            .finally(() => {
                App.Common.PendingCallbackList.remove(timespan);
            });
    };

    /**
     * Execute a single action or function that will return a Response object.
     * @param {object} request Object that will be passed to the Web API endpoint to execute an action or function request.
     * @returns {object} The response object returned by the function or action.
     * */
    const executeWithResponse = async (request) => {
        const response = await execute(request);
        if (!response || !response.ok) {
            App.Common.Error(`Unable to execution ${request.getMetadata().operationName} function.`);
            return null;
        }

        const result = await response.json();
        if (!result) {
            App.Common.Error(`Unable to parse response body to JSON.`);
            return null;
        }

        return result;
    };

    const executeMultiple = async (requests) => {
        const timespan = new Date().getTime();
        App.Common.PendingCallbackList.add(timespan);
        App.Common.Log(`App.Helper.ExecuteMultiple(${timespan})\n${requests}`);
        return await Xrm.WebApi.online.execute(requests)
            .catch((error) => {
                App.Common.Error(error);
            })
            .finally(() => {
                App.Common.PendingCallbackList.remove(timespan);
            });
    };
    // #endregion

    // #region Xrm.WebApi > Function

    /**
     * @typedef {object} WhoAmIResponse System user ID for the currently logged on user or the user under whose context the code is running
     * @property {string} BusinessUnitId Format: Guid. ID of the business to which the logged on user belongs.
     * @property {string} UserId Format: Guid. ID of the user who is logged on.
     * @property {string} OrganizationId Format: Guid. ID of the organization that the user belongs to.
     * */

    /**
     * Retrieves the system user ID for the currently logged on user or the user under whose context the code is running.
     * @returns {WhoAmIResponse} System user ID for the currently logged on user or the user under whose context the code is running
     * */
    const whoAmI = async () => {
        const requestGenerator = new executeRequestGenerator(sdkValue.boundParameter_UnboundActionFunction, sdkValue.operationType_Function, webApiFunction.whoAmI);

        const whoAmIRequest = requestGenerator.generate();
        const result = await executeWithResponse(whoAmIRequest);

        return result;
    };

    // #endregion

    // #region Security Roles

    const getRolesName = async (currentUserRoleIds) => {
        let rolesName = [];
        let filters = "";

        for (let i = 0; i < currentUserRoleIds.length; i++) {
            if (i !== 0) filters += ` ${booleanOperator.or} `;
            filters += `${field.role_PrimaryKey} ${comparisonOperator.equal} ${currentUserRoleIds[i]}`;
        }

        try {
            const result = await retrieveMultipleRecords(entity.role, queryOption.queryRole.replace("{0}", filters));

            if (result.entities !== null && result.entities.length > 0) {
                for (let j = 0; j < result.entities.length; j++) {
                    rolesName.push(result.entities[j][field.role_Name]);
                }
            }
        } catch (e) {
            App.Common.Error(e);
            openAlertDialog(message.retrieveRoleNameError);
        }

        return rolesName;
    };

    //this userrole can check related team security role
    const userHasRoles = async (rolesToVerify) => {
        let matchingRoles = [];

        if (rolesToVerify.length === 0)
            return false;

        const currentUserRoles = getUserRoles();
        const rolesName = await getRolesName(currentUserRoles);

        if (rolesName.length === 0)
            return false;

        rolesToVerify.forEach((e1) => rolesName.forEach((e2) => {
            if (e1 === e2) {
                matchingRoles.push(e1);
            }
        }));

        return matchingRoles.length > 0;
    };

    /**
     * @param {string} securityRoles - The security roles to check if the initiating user has any of these security roles (OR rule). Semi-colon (;) seperated. String is case-sensitive.
     * @returns {Promise<boolean>} - A Promise that returns boolean value where TRUE indicates that user has the specified security role.
     */
    const userHasRolesByAction = async (securityRoles) => {
        try {
            if (!App.Common.IsString(securityRoles)) {
                throw new Error(message.supportedParamString.replace("{0}", "securityRoleCondition"));
            }

            const parameters = {
                SecurityRoles: securityRoles
            };
            const result = await App.XMLHttpRequestHelper.Request(App.XMLHttpRequestHelper.HTTPMethod.post, `/${action.appCheckIfUserInRole}`, parameters);
            return result.IsUserInRole;
        }
        catch (ex) {
            App.Common.Log(ex);
            return false;
        }
    };

    // #endregion

    return {
        // #region constant
        SdkValue: sdkValue,
        // #endregion

        // #region Execution Context
        GetFormContext: getFormContext,
        GetSharedVariable: getSharedVariable,
        SetSharedVariable: setSharedVariable,
        // #endregion

        // #region Save Event Arguments
        IsSaveModeSave: isSaveModeSave,
        IsSaveModeSaveAndClose: isSaveModeSaveAndClose,
        IsSaveModeDeactivate: isSaveModeDeactivate,
        IsSaveModeReactivate: isSaveModeReactivate,
        IsSaveModeSend: isSaveModeSend,
        IsSaveModeDisqualify: isSaveModeDisqualify,
        IsSaveModeQualify: isSaveModeQualify,
        IsSaveModeAssign: isSaveModeAssign,
        IsSaveModeSaveAsCompleted: isSaveModeSaveAsCompleted,
        IsSaveModeSaveAndNew: isSaveModeSaveAndNew,
        IsSaveModeAutoSave: isSaveModeAutoSave,
        // #endregion

        // #region Attributes
        GetAttribute: getAttribute,
        AddOnChange: addOnChange,
        FireOnChange: fireOnChange,
        IsAttributeTypeBoolean: isAttributeTypeBoolean,
        IsAttributeTypeDateTime: isAttributeTypeDateTime,
        IsAttributeTypeDecimal: isAttributeTypeDecimal,
        IsAttributeTypeDouble: isAttributeTypeDouble,
        IsAttributeTypeInteger: isAttributeTypeInteger,
        IsAttributeTypeLookup: isAttributeTypeLookup,
        IsAttributeTypeMemo: isAttributeTypeMemo,
        IsAttributeTypeMoney: isAttributeTypeMoney,
        IsAttributeTypeMultiOptionSet: isAttributeTypeMultiOptionSet,
        IsAttributeTypeOptionSet: isAttributeTypeOptionSet,
        IsAttributeTypeString: isAttributeTypeString,
        IsFormatDate: isFormatDate,
        IsFormatDateTime: isFormatDateTime,
        IsFormatDuration: isFormatDuration,
        IsFormatEmail: isFormatEmail,
        IsFormatLanguage: isFormatLanguage,
        IsFormatNone: isFormatNone,
        IsFormatPhone: isFormatPhone,
        IsFormatText: isFormatText,
        IsFormatTextarea: isFormatTextarea,
        IsFormatTickerSymbol: isFormatTickerSymbol,
        IsFormatTimeZone: isFormatTimeZone,
        IsFormatUrl: isFormatUrl,
        GetInitialValue: getInitialValue,
        IsDirtyAttribute: isDirtyAttribute,
        IsPartyList: isPartyList,
        GetMax: getMax,
        GetMaxLength: getMaxLength,
        GetMin: getMin,
        GetAttributeName: getAttributeName,
        GetOption: getOption,
        GetOptions: getOptions,
        GetPrecision: getPrecision,
        IsRequiredLevelNone: isRequiredLevelNone,
        IsRequiredLevelRequired: isRequiredLevelRequired,
        IsRequiredLevelRecommended: isRequiredLevelRecommended,
        GetSelectedOption: getSelectedOption,
        IsSubmitModeAlways: isSubmitModeAlways,
        IsSubmitModeNever: isSubmitModeNever,
        IsSubmitModeDirty: isSubmitModeDirty,
        GetText: getText,
        CanRead: canRead,
        CanUpdate: canUpdate,
        CanCreate: canCreate,
        GetValue: getValue,
        GetValueOfLookup: getValueOfLookup,
        GetEntityTypeOfLookup: getEntityTypeOfLookup,
        GetIdOfLookup: getIdOfLookup,
        GetNameOfLookup: getNameOfLookup,
        IsValidAttribute: isValidAttribute,
        SetPrecision: setPrecision,
        SetRequiredLevel: setRequiredLevel,
        SetRequiredLevelToNone: setRequiredLevelToNone,
        SetRequiredLevelToRequired: setRequiredLevelToRequired,
        SetRequiredLevelToRecommended: setRequiredLevelToRecommended,
        SetSubmitModeToAlways: setSubmitModeToAlways,
        SetSubmitModeToNever: setSubmitModeToNever,
        SetSubmitModeToDirty: setSubmitModeToDirty,
        SetValue: setValue,
        SetValueOfLookup: setValueOfLookup,
        RemoveValue: removeValue,
        HasValue: hasValue,
        // #endregion

        // #region Controls
        GetControl: getControl,
        AddNotification: addNotification,
        AddNotificationError: addNotificationError,
        AddNotificationRecommendation: addNotificationRecommendation,
        SetNotification: setNotification,
        AddOption: addOption,
        ClearNotification: clearNotification,
        ClearOptions: clearOptions,
        IsFieldDisabled: isFieldDisabled,
        IsFieldEnabled: isFieldEnabled,
        SetFieldDisabled: setFieldDisabled,
        DisabledField: disabledField,
        EnabledField: enabledField,
        DisabledSection: disabledSection,
        DisabledForm: disabledForm,
        IsFieldVisible: isFieldVisible,
        IsFieldHidden: isFieldHidden,
        ShowField: showField,
        HideField: hideField,
        RemoveOption: removeOption,
        RemoveHeaderOption: removeHeaderOption,
        SetFieldFocus: setFieldFocus,
        // #endregion

        // #region formContext.data
        RefreshData: refreshData,
        RefreshForm: refreshForm,
        SaveData: saveData,
        SaveAndNewEntity: saveAndNewEntity,
        SaveAndCloseEntity: saveAndCloseEntity,
        SaveEntity: saveEntity,
        IsValidEntity: isValidEntity,
        // #endregion

        // #region formContext.data.entity
        GetEntityName: getEntityName,
        GetEntityReference: getEntityReference,
        GetEntityId: getEntityId,
        IsDirtyForm: isDirtyForm,
        // #endregion

        // #region formContext.ui
        ClearFormNotification: clearFormNotification,
        Close: close,
        IsFormTypeUndefined: isFormTypeUndefined,
        IsFormTypeCreate: isFormTypeCreate,
        IsFormTypeUpdate: isFormTypeUpdate,
        IsFormTypeReadOnly: isFormTypeReadOnly,
        IsFormTypeDisabled: isFormTypeDisabled,
        IsFormTypeBulkEdit: isFormTypeBulkEdit,
        RefreshRibbon: refreshRibbon,
        SetFormEntityName: setFormEntityName,
        SetFormNotificationInformation: setFormNotificationInformation,
        SetFormNotificationWarning: setFormNotificationWarning,
        SetFormNotificationError: setFormNotificationError,
        // #endregion

        // #region formContext.ui.formSelector
        Navigate: navigate,
        // #endregion

        // #region formContext.ui.navigation
        HideNavigation: hideNavigation,
        ShowNavigation: showNavigation,
        // #endregion

        // #region formCotext.ui.sections
        IsTabCollapsed: isTabCollapsed,
        IsTabExpanded: isTabExpanded,
        IsTabVisible: isTabVisible,
        IsTabHidden: isTabHidden,
        CollapseTab: collapseTab,
        ExpandTab: expandTab,
        HideTab: hideTab,
        ShowTab: showTab,
        // #endregion

        // #region formcontext.ui.tabs
        HideSection: hideSection,
        ShowSection: showSection,
        // #endregion

        // #region GridControl
        RefreshGrid: refreshGrid,
        // #endregion

        // #region Xrm.Navigation
        OpenAlertDialog: openAlertDialog,
        OpenConfirmDialog: openConfirmDialog,
        // #endregion

        // #region Xrm.Utility
        CloseProgressIndicator: closeProgressIndicator,
        GetUserId: getUserId,
        GetUserName: getUserName,
        GetUserRoles: getUserRoles,
        GetClientUrl: getClientUrl,
        InvokeProcessAction: invokeProcessAction,
        ShowProgressIndicator: showProgressIndicator,
        // #endregion

        // #region Xrm.WebApi
        CreateRecord: createRecord,
        DeleteRecord: deleteRecord,
        RetrieveMultipleRecords: retrieveMultipleRecords,
        RetrieveRecord: retrieveRecord,
        UpdateRecord: updateRecord,
        IsAvailableOffline: isAvailableOffline,
        ExecuteRequestGenerator: executeRequestGenerator,
        Execute: execute,
        ExecuteWithResponse: executeWithResponse,
        ExecuteMultiple: executeMultiple,
        // #endregion

        // #region Xrm.WebApi > Function
        WhoAmI: whoAmI,
        // #endregion

        // #region Security Roles

        GetRolesName: getRolesName,
        /**
         * Invokes "Check If User In Role" action to check if current user has the security role specified in the Action.
         */
        UserHasRoles: userHasRoles

        // #endregion
    };
})();

// TODO: pending try catch handling
/* modified from source: https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/samples/basic-operations-client-side-javascript */
App.XMLHttpRequestHelper = (() => {
    "use strict";

    const
        httpMethod =
        {
            delete: "DELETE",
            get: "GET",
            patch: "PATCH",
            post: "POST",
            put: "PUT"
        },
        httpStatusCode =
        {
            ok: 200,
            created: 201,
            noContent: 204
        },
        message =
        {
            actionParamsError: "App.SdkHelper.request: action parameter must be one of the following: POST, PATCH, PUT, GET, or DELETE.",
            addHeaderParamError: "App.SdkHelper.request: addHeader parameter must have header and value properties that are strings.",
            errorTitle: "Process(Action) Error",
            dataParamsError: "App.SdkHelper.request: data parameter must not be null for operations that create or modify data.",
            majorNumberError: "App.SdkHelper.versionManager.WebAPIMajorVersion property must be a number.",
            minorNumberError: "App.SdkHelper.versionManager.WebAPIMinorVersion property must be a number.",
            pleaseWait: "Please Wait",
            saving: "Saving",
            unexpectedError: "Unexpected Error",
            uriParamsError: "App.SdkHelper.request: uri parameter must be a string."
        },
        readyState =
        {
            done: 4
        },
        variable =
        {
            retrieveVersionPath: "/RetrieveVersion",
            webAPIPath: "/api/data/v{0}.{1}"
        };

    // #region XMLHttpRequest
    /**
    * An object instantiated to manage detecting the
    * Web API version in conjunction with the
    * retrieveVersion function
    */
    const versionManager = new class {
        constructor() {
            this._webAPIMajorVersion = 9;
            this._webAPIMinorVersion = 1;
        }

        get webAPIMajorVersion() {
            return this._webAPIMajorVersion;
        }

        set webAPIMajorVersion(value) {
            if (isNaN(value)) {
                throw new Error(message.majorNumberError);
            }
            this._webAPIMajorVersion = value;
        }

        get webAPIMinorVersion() {
            return this._webAPIMinorVersion;
        }

        set webAPIMinorVersion(value) {
            if (isNaN(value)) {
                throw new Error(message.minorNumberError);
            }
            this._webAPIMinorVersion = value;
        }

        get webAPIPath() {
            return variable.webAPIPath.replace("{0}", this._webAPIMajorVersion).replace("{1}", this._webAPIMinorVersion);
        }
    }();

    const retrieveVersion = () => {
        return new Promise((resolve, reject) => {
            request(httpMethod.get, variable.retrieveVersionPath)
                .then((request) => {
                    try {
                        const retrieveVersionResponse = App.Common.JsonParse(request.response);
                        const fullVersion = retrieveVersionResponse.Version;
                        const versionData = fullVersion.split(".");
                        versionManager.webAPIMajorVersion = parseInt(versionData[0], 10);
                        versionManager.webAPIMinorVersion = parseInt(versionData[1], 10);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    const getWebAPIUrl = () => App.Helper.GetClientUrl() + versionManager.webAPIPath;

    /**
     * @function request
     * @description Generic helper function to handle basic XMLHttpRequest calls.
     * @param {string} action - The request action. String is case-sensitive.
     * @param {string} uri - An absolute or relative URI. Relative URI starts with a "/".
     * @param {object} data - An object representing an entity. Required for create and update actions.
     * @param {object} addHeader - An object with header and value properties to add to the request
     * @returns {Promise} - A Promise that returns either the request object or an error object.
     */
    const request = (action, uri, data, addHeader) => {
        if (!RegExp(action, "g").test(`${httpMethod.post} ${httpMethod.patch} ${httpMethod.put} ${httpMethod.get} ${httpMethod.delete}`)) { // Expected action verbs.
            throw new Error(message.actionParamsError);
        }
        if (!App.Common.IsString(uri)) {
            throw new Error(message.uriParamsError);
        }
        if (RegExp(action, "g").test(`${httpMethod.post} ${httpMethod.patch} ${httpMethod.put}`) && !data) {
            throw new Error(message.dataParamsError);
        }
        if (addHeader) {
            if (!App.Common.IsString(addHeader.header) || !App.Common.IsString(addHeader.value)) {
                throw new Error(message.addHeaderParamError);
            }
        }

        // Construct a fully qualified URI if a relative URI is passed in.
        if (uri.charAt(0) === "/") {
            //This sample will try to use the latest version of the web API as detected by the
            // Sdk.retrieveVersion function.
            uri = getWebAPIUrl() + uri;
        }

        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open(action, encodeURI(uri), true);
            request.setRequestHeader("OData-MaxVersion", "4.0");
            request.setRequestHeader("OData-Version", "4.0");
            request.setRequestHeader("Accept", "application/json");
            request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            if (addHeader) {
                request.setRequestHeader(addHeader.header, addHeader.value);
            }
            request.onreadystatechange = () => {
                if (request.readyState === readyState.done) {
                    request.onreadystatechange = null;
                    let error;
                    switch (request.status) {
                        case httpStatusCode.ok: // Operation success with content returned in response body.
                        case httpStatusCode.created: // Create success.
                        case httpStatusCode.noContent: // Operation success with no content returned in response body.
                            resolve(App.Common.JsonParse(request.response));
                            break;
                        default: // All other statuses are unexpected so are treated like errors.
                            try {
                                error = App.Common.JsonParse(request.response).error;
                            } catch (e) {
                                error = new Error(variable.unexpectedError);
                            }
                            reject(error);
                            break;
                    }
                    App.Common.PendingCallbackList.remove(uri);
                }
            };
            App.Common.PendingCallbackList.add(uri);
            request.send(JSON.stringify(data));
        });
    };

    const retrieveMutipleByFetchXML = (uri, fetchXML, addHeader) => {
        if (!App.Common.IsString(uri)) {
            throw new Error(message.uriParamsError);
        }
        if (!App.Common.IsString(fetchXML)) {
            throw new Error(message.uriParamsError);
        }
        if (addHeader) {
            if (!App.Common.IsString(addHeader.header) || !App.Common.IsString(addHeader.value)) {
                throw new Error(message.addHeaderParamError);
            }
        }

        // Construct a fully qualified URI if a relative URI is passed in.
        if (uri.charAt(0) === "/") {
            //This sample will try to use the latest version of the web API as detected by the
            // Sdk.retrieveVersion function.
            uri = getWebAPIUrl() + uri;
        }

        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open(httpMethod.get, encodeURI(`${uri}?fetchXml=${encodeURIComponent(fetchXML)}`), true);
            request.setRequestHeader("OData-MaxVersion", "4.0");
            request.setRequestHeader("OData-Version", "4.0");
            request.setRequestHeader("Accept", "application/json");
            request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            if (addHeader) {
                request.setRequestHeader(addHeader.header, addHeader.value);
            }
            request.onreadystatechange = () => {
                if (request.readyState === readyState.done) {
                    request.onreadystatechange = null;
                    let error;
                    switch (request.status) {
                        case httpStatusCode.ok: // Operation success with content returned in response body.
                        case httpStatusCode.created: // Create success.
                        case httpStatusCode.noContent: // Operation success with no content returned in response body.
                            resolve(App.Common.JsonParse(request.response));
                            break;
                        default: // All other statuses are unexpected so are treated like errors.
                            try {
                                error = App.Common.JsonParse(request.response).error;
                            } catch (e) {
                                error = new Error(variable.unexpectedError);
                            }
                            reject(error);
                            break;
                    }
                    App.Common.PendingCallbackList.remove(fetchXML);
                }
            };
            App.Common.PendingCallbackList.add(fetchXML);
            request.send();
        });
    };

    const callAction = async (processUniqueName, parameters, executionContext, progressIndicatorMessage, throwException) => {
        var saveSuccessCallBack = true;
        if (executionContext) {
            var formContext = App.Helper.GetFormContext(executionContext);
            if (formContext) {
                await formContext.data.save(App.Helper.SdkValue.saveModeSave)
                    .catch((error) => {
                        App.Common.Error(error);
                        App.Helper.OpenAlertDialog(error.message, message.errorTitle);
                        saveSuccessCallBack = false;
                    });
            }
        }

        if (!saveSuccessCallBack)
            return;

        App.Helper.ShowProgressIndicator(progressIndicatorMessage || message.pleaseWait);
        return await App.XMLHttpRequestHelper.Request(httpMethod.post, `/${processUniqueName}`, parameters)
            .catch(error => {
                App.Common.Error(error);
                App.Helper.OpenAlertDialog(error.message, message.errorTitle);
                if (throwException)
                    throw error;
                else
                    return;
            })
            .finally(() => {
                App.Helper.CloseProgressIndicator();
            });
    };
    // #endregion

    return {
        // XMLHttpRequest
        GetWebAPIUrl: getWebAPIUrl,
        HTTPMethod: httpMethod,
        Request: request,
        RetrieveMutipleByFetchXML: retrieveMutipleByFetchXML,
        RetrieveVersion: retrieveVersion,

        // Dynamics 365 Action
        CallAction: callAction
    };
})();

// Array js extension - add
Array.prototype.add = function () {
    "use strict";
    if (arguments.length) {
        App.Common.Log(`[${Date().toString()}] API callback added: ${arguments[0].toString()}`);
        this.push(arguments[0]);
    }
    return this;
};

// Array js extension - remove
Array.prototype.remove = function () {
    "use strict";
    if (arguments.length) {
        App.Common.Log(`[${Date().toString()}] API callback removed: ${arguments[0].toString()}`);
        const indexOfFirstArgument = this.indexOf(arguments[0]);
        if (indexOfFirstArgument !== -1)
            this.splice(indexOfFirstArgument, 1);
    }
    return this;
};