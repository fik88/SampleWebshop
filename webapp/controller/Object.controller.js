/*global location*/
sap.ui.define([
	"cbsgmbh/webshop/WebShop/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	'sap/m/MessageToast',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"cbsgmbh/webshop/WebShop/model/formatter",
	"cbsgmbh/webshop/WebShop/utils/utilities"
], function(
	BaseController,
	JSONModel,
	History,
	messages,
	Filter, FilterOperator,
	formatter,
	utilities
) {
	"use strict";

	return BaseController.extend("cbsgmbh.webshop.WebShop.controller.Object", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this._oResourceBundle = this.getResourceBundle();

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this._oModel = this.getModel();
			this._oItemsTable = this.byId("item");
			this._oItemTemplate = this.byId("itemList").clone();
			this._oView = this.getView();

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			
			this._oModel.resetChanges();
			
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("worklist", {}, true);
			}
		},

		onSave: function() {
			this._createOrder();
		},

		onCancel: function() {
			this._oOrderDialog.close();
		},

		onCreateOrder: function(oEvent) {
			if (!this._oOrderDialog) {
				this._oOrderDialog = this._createDialog("cbsgmbh.webshop.WebShop.view.fragment.OrderDetails");
			}
			this._oOrderDialog.open();

		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("Package_HeaderSet", {
					Package_Id: sObjectId
				});

				this._bindView("/" + sObjectPath);
				this._bindItems(sObjectId);

			}.bind(this));

		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function(sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});

		},

		_bindItems: function(sObjectId) {

			var aTableFilter = [new Filter("Package_Id", FilterOperator.EQ, sObjectId)];

			this._oItemsTable.getBinding("items").filter(aTableFilter, "Application");

		},

		_onBindingChange: function() {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.Package_Id,
				sObjectName = oObject.Package_Desc;

			// Everything went fine.
			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		_createOrder: function(oEvent) {

			var bCheck = function() {
				var sSoldTo = sap.ui.getCore().byId("soldto").getSelectedKey();
				var sShipTo = sap.ui.getCore().byId("shipto").getSelectedKey();

				if (sSoldTo === "") {
					sap.ui.getCore().byId("soldto").setValueState(sap.ui.core.ValueState.Error);
					return false;

				}

				if (sShipTo === "") {
					sap.ui.getCore().byId("shipto").setValueState(sap.ui.core.ValueState.Error);
					return false;
				}
				return true;
			}.bind(this);

			var bInCheck = bCheck();

			if (bInCheck === true) {
				this._createSalesData();
			}
		},

		_createSalesData: function() {

			var oOrderHeader = {
				Order_Id: '0',
				Sold_To: sap.ui.getCore().byId("soldto").getSelectedKey(),
				Ship_To: sap.ui.getCore().byId("shipto").getSelectedKey(),
				Package_Id: this.byId("objectHeader").getTitle(),
				SalesOrderHeaderToSalesOrderItems: []
			};

			var oItems = this.byId("item").getItems(),
				sItem;
			for (var i = 0; i < oItems.length; i++) {

				sItem = this._oModel.getProperty("Material_Number", oItems[i].getBindingContext());
				oOrderHeader.SalesOrderHeaderToSalesOrderItems.push({
					Order_Id: '0',
					Material_Number: sItem
				});
			}

			this._oModel.setUseBatch(false);
			this._oModel.create("/Sales_OrderHeaderSet", oOrderHeader, {
				success: function(result) {
					var sMsg = this._oResourceBundle.getText("ymsg.orderCreated") + result.Order_Id;
					messages.show(sMsg);
					this._oOrderDialog.close();

				}.bind(this),
				error: function(err) {

				}.bind(this)

			});

		},

		/**		
		 * Create dialog constructor method
		 * @constructor constructor for creating dialog
		 * @param {String} sDialog dialog fragment name
		 * @returns return dialog
		 */
		_createDialog: function(sDialog) {
			var oDialog = sap.ui.xmlfragment(sDialog, this);
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this._oView, oDialog);
			utilities.attachControl(this._oView, oDialog);
			return oDialog;
		}
	});

});