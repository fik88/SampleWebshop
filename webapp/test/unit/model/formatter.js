/*global QUnit*/

sap.ui.define([
	"cbsgmbh/webshop/WebShop/model/formatter",
	"test/unit/helper/FakeI18nModel",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(formatter, FakeI18n) {
	"use strict";

	QUnit.module("Number unit");

	function numberUnitValueTestCase(assert, sValue, fExpectedNumber) {
		// Act
		var fNumber = formatter.numberUnit(sValue);

		// Assert
		assert.strictEqual(fNumber, fExpectedNumber, "The rounding was correct");
	}

	QUnit.test("Should round down a 3 digit number", function(assert) {
		numberUnitValueTestCase.call(this, assert, "3.123", "3.12");
	});

	QUnit.test("Should round up a 3 digit number", function(assert) {
		numberUnitValueTestCase.call(this, assert, "3.128", "3.13");
	});

	QUnit.test("Should round a negative number", function(assert) {
		numberUnitValueTestCase.call(this, assert, "-3", "-3.00");
	});

	QUnit.test("Should round an empty string", function(assert) {
		numberUnitValueTestCase.call(this, assert, "", "");
	});

	QUnit.test("Should round a zero", function(assert) {
		numberUnitValueTestCase.call(this, assert, "0", "0.00");
	});

	QUnit.module("Rating", {
		setup: function() {
			var oControllerStub = {
				getModel: sinon.stub().withArgs("i18n").returns(new FakeI18n({
					formatterGood: "good",
					formatterBad: "bad"
				}))
			};
			this.fnIsolatedFormatter =
				formatter.rating.bind(oControllerStub);
		},
		teardown: function() {
			this.fnIsolatedFormatter = null;
		}
	});

	QUnit.test("Should determine Rating for the package ", function(assert) {

		assert.strictEqual(this.fnIsolatedFormatter("1"), "good");
	});

	QUnit.test("Should determine Rating Bad for the package ", function(assert) {

		assert.strictEqual(this.fnIsolatedFormatter("2"), "bad");
	});
	
});