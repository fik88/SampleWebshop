sap.ui.define([
		"cbsgmbh/webshop/WebShop/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("cbsgmbh.webshop.WebShop.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);