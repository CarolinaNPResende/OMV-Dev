import { LightningElement, api, wire, track } from 'lwc';
import getCreditLimitDetails from '@salesforce/apex/creditLimitCardController.getCreditLimitDetails';
import { subscribe, MessageContext } from 'lightning/messageService';
import PORTAL_MESSAGE_CHANNEL from '@salesforce/messageChannel/PortalMessageChannel__c';
import logError from '@salesforce/apex/FW_LWCLogError.logError';
import CreditLimitUpdate from '@salesforce/apex/SL_CreditLimitUpdateDatabase.updateCreditLimits';

export default class communityCreditLimitCard extends LightningElement {
    @api accountId;
    @track creditLimit = [];
    creditLimitValues = [];
    accExtId;
    @api messageReceived = false;
    @track creditInformationCoutry = '';
    @api creditLimitInformationHeaderText
    @api creditLimitText
    @api remainingCreditLimitText
    @api openItemsText
    @api validUntilText
    @api lastUpdateDateText
    isLoading = false;

    @api customerCountryISOCode
    @api lastRefreshed
    @api customerMasterData
    iconCreditLimit;
    iconRemainingCreditLimit;
    iconOpenItems;
    iconValidUntil;
    iconLastUpdateDate;
    @wire(MessageContext)
    messageContext;

    refreshComponent(event){
        this.isLoading = true;
        CreditLimitUpdate({accountExtId : this.accExtId}).then( result =>{
            eval("$A.get('e.force:refreshView').fire();");
            this.isLoading = false;
        }).catch( error =>{
            logError(
                {
                    lwcName:'communityCreditLimitCard',
                    message:'got error: ' + JSON.stringify(error),
                    lwcFunction:'getCreditLimitDetails'
                }
            )
            this.isLoading = false;
            eval("$A.get('e.force:refreshView').fire();");
        })
        
    }

    subscribeToMessageChannel() {
        this.subscription = subscribe(
        this.messageContext,
        PORTAL_MESSAGE_CHANNEL,
        (message) => this.handleMessage(message)
        );  
    }

    handleMessage(message) {
            try{
                let userlayout = message.omvPortalLayout;
                this.accExtId = userlayout.userInfo?.Contact?.Account?.ExternalId__c;
                this.accountId = userlayout.userInfo?.Contact?.Account?.Id;
                this.creditLimitInformationHeaderText = userlayout.translationConfiguration.CreditLimitInformationHeaderText__c;
                this.creditLimitText = userlayout.translationConfiguration.CreditLimitText__c;
                this.remainingCreditLimitText = userlayout.translationConfiguration.RemainingCreditLimitText__c;
                this.openItemsText = userlayout.translationConfiguration.OpenItemsText__c;   
                this.validUntilText = userlayout.translationConfiguration.ValidUntilText__c;
                this.lastUpdateDateText = userlayout.translationConfiguration.LastUpdateDateText__c;
                this.messageReceived = true;
                getCreditLimitDetails(
                    {}
                ).then(
                    result => {
                        // success
                        this.creditLimitValues = result.items;
                        console.log(result);
                        if(this.creditLimitValues && this.creditLimitValues.length > 0){
                            this.creditLimit = result.items[0];
                            if( this.creditLimitValues.length === 1 ){
                                this.creditLimitValues = [];
                            }
                        }else{
                            this.setBlankValues();
                        }
                        this.iconCreditLimit = result.iconCreditLimit;
                        this.iconRemainingCreditLimit = result.iconRemainingCreditLimit;
                        this.iconOpenItems = result.iconOpenItems;
                        this.iconValidUntil = result.iconValidUntil;
                        this.iconLastUpdateDate = result.iconLastUpdateDate;
                    }
                ).catch(
                    error => {
                        // error
                        logError(
                            {
                                lwcName:'communityCreditLimitCard',
                                message:'got error: ' + JSON.stringify(error),
                                lwcFunction:'getCreditLimitDetails'
                            }
                        )
                    }
                );
            }catch(error){
                // error
                logError(
                    {
                        lwcName:'communityCreditLimitCard',
                        message:'got error: ' + JSON.stringify(error),
                        lwcFunction:'getCreditLimitDetails'
                    }
                )
            }
    }
    creditLimitChanged(event){
        let newValue = this.creditLimitValues.filter(opt => opt.creditLimitId === event.target.id.substring(0,event.target.id.indexOf('-') ) );
        this.creditLimit = newValue[0];
        this.creditInformationCoutry = this.creditLimit.creditInformationCoutry;
        this.changeButtonClass();
    }
    setBlankValues(){
        let blankCreditLimit = {};
        
        blankCreditLimit.creditLimit = '';
        blankCreditLimit.remainingCreditLimit = '';
        blankCreditLimit.openItems = '';
        blankCreditLimit.validUntil = '';
        blankCreditLimit.lastUpdateDate = '';
        blankCreditLimit.creditInformationCoutry = '';
        blankCreditLimit.creditInformationCoutry = '';
        this.creditLimit = blankCreditLimit;

    }
    changeButtonClass(){

        for(let index = 0; index <this.creditLimitValues.length; index++ ){
            if( this.creditLimitValues[index].creditLimitId === this.creditLimit.creditLimitId ){
                let buttonQueried = this.template.querySelector('[data-id="'+ this.creditLimitValues[index].creditLimitId +'"]');
                if(buttonQueried){
                    this.template.querySelector('[data-id="'+ this.creditLimitValues[index].creditLimitId +'"]').className= 'dotSelected';
                }
            }else{
                let buttonQueried = this.template.querySelector('[data-id="'+ this.creditLimitValues[index].creditLimitId +'"]');
                if(buttonQueried){
                    this.template.querySelector('[data-id="'+ this.creditLimitValues[index].creditLimitId +'"]').className= 'dot';
                }
            }
        }
    }
    
    connectedCallback() {
        this.subscribeToMessageChannel();
        
    }
    renderedCallback(){
        this.changeButtonClass();
    }
}