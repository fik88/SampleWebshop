/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"cbsgmbh/webshop/WebShop/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"cbsgmbh/webshop/WebShop/test/integration/pages/Worklist",
	"cbsgmbh/webshop/WebShop/test/integration/pages/Object",
	"cbsgmbh/webshop/WebShop/test/integration/pages/NotFound",
	"cbsgmbh/webshop/WebShop/test/integration/pages/Browser",
	"cbsgmbh/webshop/WebShop/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "cbsgmbh.webshop.WebShop.view."
	});

	sap.ui.require([
		"cbsgmbh/webshop/WebShop/test/integration/WorklistJourney",
		"cbsgmbh/webshop/WebShop/test/integration/ObjectJourney",
		"cbsgmbh/webshop/WebShop/test/integration/NavigationJourney",
		"cbsgmbh/webshop/WebShop/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});