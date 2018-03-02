/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("Object");

	opaTest("Should see the busy indicator on object view after metadata is loaded", function(Given, When, Then) {

		// Arrangements
		Given.iStartMyApp();

		//Actions
		When.onTheWorklistPage.iRememberTheItemAtPosition(1);
		When.onTheBrowser.iRestartTheAppWithTheRememberedItem({
			delay: 1000
		});
		When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

		// Assertions
		Then.onTheObjectPage.iShouldSeeTheObjectViewsBusyIndicator().
		and.theObjectViewsBusyIndicatorDelayIsRestored().
		and.iShouldSeeTheRememberedObject();

	});

	opaTest("Should see the Create Sales Order button", function(Given, When, Then) {

		// Assertions
		Then.onTheObjectPage.iShouldSeeTheCreateSalesOrderButton();

	});

	opaTest("Create Sales Order Button open a new dialog", function(Given, When, Then) {

		// Actions
		When.onTheObjectPage.iPressCreateSalesOrderButton();

		// Assertions
		Then.onTheObjectPage.iShouldSeeTheCreateOrderDialog().and.iTeardownMyAppFrame();

	});

});