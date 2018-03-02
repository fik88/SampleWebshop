sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"cbsgmbh/webshop/WebShop/utils/utilities"
], function(MessageBox, JSONModel, utilities) {
	"use strict";

	function fnParseError(oParameter) {
		var sMessage = "",
			sDetails = "",
			oParameters = null,
			oError = {};
		oParameters = oParameter.getParameters ? oParameter.getParameters() : oParameter;
		sMessage = oParameters.message || oParameters.response.message;
		sDetails = oParameters.responseText || oParameters.response.responseText;

		if (jQuery.sap.startsWith(sDetails || "", "{\"error\":")) {
			var oErrModel = new JSONModel();
			oErrModel.setJSON(sDetails);
			sMessage = oErrModel.getProperty("/error/message/value");
		}

		oError.sDetails = sDetails;
		oError.sMessage = sMessage;
		return oError;
	}

	return {
		// Show an error dialog with information from the oData response object.
		// oParameter - The object containing error information
		showErrorMessage: function(oParameter, sTitle) {
			var oErrorDetails = fnParseError(oParameter);
			MessageBox.show(oErrorDetails.sMessage, {
				icon: MessageBox.Icon.ERROR,
				title: sTitle,
				details: oErrorDetails.sDetails,
				actions: MessageBox.Action.CLOSE,
				onClose: null,
				styleClass: utilities.getContentDensityClass()
			});
		},
		// Message Box wrapper function with:
		// @Param1: sMessage - Message information
		// @Param2: sType - E: Error; S: Success; W: Warning; I: Information
		// @Param3: sTitle - Title of Message Box
		showMessage: function(sMessage, sType, sTitle) {
			var oIcon;
			// Defind which Icon to use based on sType
			switch (sType) {
				case "E":
					oIcon = MessageBox.Icon.ERROR;
					break;
				case "S":
					oIcon = MessageBox.Icon.SUCCESS;
					break;
				case "W":
					oIcon = MessageBox.Icon.WARNING;
					break;
				case "I":
					oIcon = MessageBox.Icon.INFORMATION;
					break;
				default:
					oIcon = MessageBox.Icon.NONE;
					break;
			}
			MessageBox.show(sMessage, {
				icon: oIcon,
				title: sTitle,
				actions: MessageBox.Action.CLOSE,
				onClose: null,
				styleClass: utilities.getContentDensityClass()
			});
		}
	};
});