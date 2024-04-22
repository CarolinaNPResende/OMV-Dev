import { LightningElement, wire, api } from "lwc";

import INVOICENUMBER_FIELD from "@salesforce/schema/Invoice__c.Name";
import AMOUNT_FIELD from "@salesforce/schema/Invoice__c.Amount__c";
import DUEDATE_FIELD from "@salesforce/schema/Invoice__c.DueDate__c";
import DUEDATEINDICATOR_FIELD from "@salesforce/schema/Invoice__c.TrafficLight__c";
import INVOICECURRENCY_FIELD from "@salesforce/schema/Invoice__c.CurrencyIsoCode";
import ORDERCURRENCY_FIELD from "@salesforce/schema/Order.CurrencyIsoCode";
import INVOICE_OBJECT from "@salesforce/schema/Invoice__c";
import ORDER_OBJECT from "@salesforce/schema/Order";
import ORDERNUMBER_FIELD from "@salesforce/schema/Order.OrderNumber";
import STORAGE_FIELD from "@salesforce/schema/Order.Storage__c";
import ORDERAMOUNT_FIELD from "@salesforce/schema/Order.TotalAmount";
import STATUS_FIELD from "@salesforce/schema/Order.Status";
import { getObjectInfo } from "lightning/uiObjectInfoApi";

import getInvoiceLayout from "@salesforce/apex/CommunityDatatableHomepageController.getInvoiceInfo";
import getIndicatorMap from "@salesforce/apex/CommunityDatatableHomepageController.getIndicatorMap";
import getOrderLayout from "@salesforce/apex/CommunityDatatableHomepageController.getOrderInfo";

import logError from "@salesforce/apex/FW_LWCLogError.logError";

export default class communityDatatableHomepage extends LightningElement {
	invoiceColumns = [];
	invoiceLabel;
	@wire(getObjectInfo, { objectApiName: INVOICE_OBJECT })
	invoiceInfo({ data, error }) {
		if (data) {
			this.invoiceLabel = data.label;
			this.invoiceColumns = [
				{
					label: data.fields.Name.label,
					fieldName: "InvoiceURL",
					type: "url",
					typeAttributes: { label: { fieldName: INVOICENUMBER_FIELD.fieldApiName }, target: "_self" },
					sortable: true,
					cellAttributes: { alignment: "left" }
				},
				{
					label: data.fields.Amount__c.label,
					fieldName: AMOUNT_FIELD.fieldApiName,
					type: "currency",
					typeAttributes: { currencyCode: { fieldName: INVOICECURRENCY_FIELD.fieldApiName }, currencyDisplayAs: "code", step: "0.001" },
					cellAttributes: { alignment: "left" }
				},
				{ label: data.fields.DueDate__c.label, fieldName: DUEDATE_FIELD.fieldApiName, type: "date", cellAttributes: { alignment: "left" } },
				{
					label: data.fields.TrafficLight__c.label,
					fieldName: DUEDATEINDICATOR_FIELD.fieldApiName,
					type: "image",
					typeAttributes: { imgUrl: { fieldName: "URL" } },
					cellAttributes: { alignment: "left" }
				}
			];
		}
	}
	invoices;

	orderColumns = [];
	orderLabel;
	@wire(getObjectInfo, { objectApiName: ORDER_OBJECT })
	orderInfo({ data, error }) {
		if (data) {
			this.orderLabel = data.label;
			this.orderColumns = [
				{
					label: data.fields.OrderNumber.label,
					fieldName: "OrderURL",
					type: "url",
					typeAttributes: { label: { fieldName: ORDERNUMBER_FIELD.fieldApiName }, target: "_self" },
					sortable: true,
					cellAttributes: { alignment: "left" }
				},
				{ label: data.fields.Storage__c.label, fieldName: STORAGE_FIELD.fieldApiName, cellAttributes: { alignment: "left" } },
				{ label: data.fields.Status.label, fieldName: STATUS_FIELD.fieldApiName, cellAttributes: { alignment: "left" } },
				{ label: data.fields.TotalAmount.label, fieldName: ORDERAMOUNT_FIELD.fieldApiName, type: "currency", 
					typeAttributes: { currencyCode: { fieldName: ORDERCURRENCY_FIELD.fieldApiName }, currencyDisplayAs: "code", step: "0.001" },
					cellAttributes: { alignment: "left" } }
			];
		}
	}
	orders;

	connectedCallback() {
		let indicatorMap = {};
		getIndicatorMap({})
			.then((result) => {
				indicatorMap = result;

				getInvoiceLayout({})
					.then((resultInvoice) => {
                        if( resultInvoice ){
                            this.invoices = resultInvoice;

                            for (var i = 0; i < this.invoices.length; i++) {
                                this.invoices[i].URL = indicatorMap[this.invoices[i].DueDateIndicatorColor__c];
                                this.invoices[i].InvoiceURL = "/detail/" + this.invoices[i].Id;
                            }
                        }
					})
					.catch((error) => {
						// error
						logError({
							lwcName: "communityDatatableHomepage",
							message: "Error getting Invoice info: " + JSON.stringify(error),
							lwcFunction: "getInvoiceLayout"
						});
					});
			})
			.catch((error) => {
				// error
				logError({
					lwcName: "communityDatatableHomepage",
					message: "Error getting indicator map: " + JSON.stringify(error),
					lwcFunction: "getIndicatorMap"
				});
			});
		getOrderLayout({})
			.then((resultOrder) => {
                if( resultOrder ){
                    this.orders = resultOrder;

                    for (var i = 0; i < this.orders.length; i++) {
                        this.orders[i].OrderURL = "/order/" + this.orders[i].Id;
                    }
                }
			})
			.catch((error) => {
				// error
				logError({
					lwcName: "communityDatatableHomepage",
					message: "Error getting Order info: " + JSON.stringify(error),
					lwcFunction: "getOrderLayout"
				});
			});
	}
}