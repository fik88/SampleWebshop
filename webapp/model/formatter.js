sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		rating: function(sRate) {

			var oResourceBundle = this.getModel("i18n").getResourceBundle(), 
			    sRating = "";

			if (sRate === "1") {
				sRating =oResourceBundle.getText("xtxt.formatterGood");
			} else if (sRate === "2") {
				sRating =oResourceBundle.getText("xtxt.formatterBad");
			}

			return sRating;
		}

	};

});