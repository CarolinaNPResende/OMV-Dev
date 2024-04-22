import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';

import { subscribe, MessageContext } from 'lightning/messageService';
import PORTAL_MESSAGE_CHANNEL from '@salesforce/messageChannel/PortalMessageChannel__c';

export default class CommunityHeader extends LightningElement {
    @wire(MessageContext)
    messageContext;
    @api isListViewTittle;
    @api isDashBoardTittle;
    @api displayText;
    @api userlayout = new Object;
    @api textStyle;
    divStyle;
    @wire(CurrentPageReference)
    wiredPageRef() {
        // console.log('communityHeader: wiredPageRef');
        
        this.init();
    }
    
    connectedCallback() {
        this.init();
    }

/*
    renderedCallback() {
        console.log('communityHeader.renderedCallback: going to call init');

        this.init();
    }
*/

     init() {
        if(this.isListViewTittle){
            this.divStyle = 'margin-right:2.6rem;';
            this.textStyle = 'opacity:.8;margin-left:0.6rem;font-weight: bold; margin-bottom:-24px;width:100%;position: relative;overflow-y: hidden;overflow-x: hidden;background-color:#003366;display: table; table-layout: fixed;text-align: left;font-size: 20px; font-family:OMV Source Sans Pro; color:white; padding-left:0.67rem; padding-top:0.3rem; padding-bottom:5px;';
        }else{
            this.textStyle = 'opacity:.8;font-weight: bold; padding-top:18px;height:70px;margin-top:-11.5px;margin-bottom:-24px;width:100%;position: relative;overflow-y: hidden;overflow-x: hidden;background-color:#003366;display: table; table-layout: fixed;text-align: center;font-size: 20px; font-family:OMV Source Sans Pro; color:white';
        }
/*
        this[NavigationMixin.Navigate](
            {
                type: 'standard__component',
                attributes: {
                }
            }
        );
*/
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        // console.log('communityHeader.subscribeToMessageChannel: subscribe to message channel');

        this.subscription = subscribe(
        this.messageContext,
        PORTAL_MESSAGE_CHANNEL,
        (message) => this.handleMessage(message)
        );  
    }

    handleMessage(message) {
        // console.log('communityHeader.handleMessage: received message ' + JSON.stringify(message));

        this.userlayout = message.omvPortalLayout;
        if(this.isListViewTittle){
            this.displayText =this.userlayout.translationConfiguration.ListViewsHeaderText__c;
        }
        else if(this.isDashBoardTittle){
            this.displayText =this.userlayout.translationConfiguration.DashboardHeaderText__c;
        }
    }
}