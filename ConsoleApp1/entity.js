var App = App || {};
App.Pana = App.Pana || {};
App.Pana.AppEntity = (() => {
    "use strict";

    // constants for this form
    const
        entity = {
            contact: {
                entityName: "contact",
                customerId: "customerid",
                emailAddress: "emailaddress",
                statusCode_OptionSet: {
                    Active: 0,
                    Inactive: 1
                }
            }
        },
        message = {
            callbackConsoleMesage: "[{0}] Pending callback list: {1}",
            pendingCallback: "API callback in progress, please try again later."
        },
        queryOption = {
            queryContact: "?$select=fullname,mobilephone,telephone1,telephone2,emailaddress1"
        },
        value = {
            unknown: "UNKNOWN"
        };

    // #region Module A
    const ModuleA = (() => {
        // Function
        const function1 = async (executionContext) => {
            const customerLookupId = App.Helper.GetIdOfLookup(executionContext, entity.contact.customerId);
            var contact = await App.Helper.RetrieveRecord(entity.contact.entityName, customerLookupId);
            // Logic here...
        };

        // Public
        return {
            Function1: function1
        };
    })();
    // #endregion

    // #region Module B
    const ModuleB = (() => {
        // Function
        const function1 = (executionContext) => {
            return executionContext;
        };

        // Public
        return {
            Function1: function1
        };
    })();
    // #endregion

    // #region Field events
    const fieldOnChange = (executionContext) => {
        ModuleA.Function1(executionContext);
    };

    // #region Tab events
    const tabOnTabStateChange = (executionContext) => {
        ModuleA.Function1(executionContext);
    };
    // #endregion

    // #region Form events
    const formOnLoad = (executionContext) => {
        ModuleB.Function1(executionContext);
    };

    const formOnSave = (executionContext) => {
        // place these at the begining of formOnSave function
        // to avoid saving if there is any pending callback
        if (App.Common.PendingCallbackHandler(executionContext)) {
            return;
        }

        ModuleB.Function1(executionContext);
    };
    // #endregion

    // Public
    return {
        // Field
        FieldOnChange: fieldOnChange,

        // Tab
        TabOnTabStateChange: tabOnTabStateChange,

        // Form
        FormOnLoad: formOnLoad,
        FormOnSave: formOnSave,

        // Command Bar
        Command: ModuleA.Function1
    };
})();