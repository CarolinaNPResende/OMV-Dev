import { LightningElement, api, wire, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import PORTAL_MESSAGE_CHANNEL from '@salesforce/messageChannel/PortalMessageChannel__c';
import checkPermission from '@salesforce/apex/SL_PermissionSetVerification.VerifyPermissionSetLWC';
import logError from '@salesforce/apex/FW_LWCLogError.logError';
import errorMessage from '@salesforce/label/c.UserManagementError';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CommunityDashButtonHomepage extends LightningElement {

  @wire(MessageContext)
  messageContext;
  @api isNewOrder;
  @api isCardManagment;
  @api isUserManagment;
  @api buttonText;
  @api buttonURL;
  @api buttonColor;
  @api buttonTextColor;
  @api userlayout = new Object;
  @api buttonFinalStyle;
  @api buttonFinalStyle2;
  @api buttonFinalStyle3;
  @api usermanagementError =false;
  @track isModalOpen = false;
  @track permissionChecked = false;
  divStyle;

  subscribeToMessageChannel() {
  this.subscription = subscribe(
  this.messageContext,
  PORTAL_MESSAGE_CHANNEL,
  (message) => this.handleMessage(message)
  );  
  }
  handleMessage(message) {
        this.userlayout = message.omvPortalLayout;
        this.buttonColor =this.userlayout.layoutConfiguration.ButtonsColor__c;
        this.buttonTextColor =this.userlayout.layoutConfiguration.ButtonsTextColor__c;
        this.usermanagementError=true;
        checkPermission({ verificationInputs: 'OMV Cards Administration'}).then( resultContact => {    
          if(resultContact){
             this.permissionChecked=true;
             if(this.isUserManagment){
                this.usermanagementError=false;
                  if(this.userlayout.userInfo.Contact.AccountId != undefined){
                      this.buttonURL='contact/related/'+ this.userlayout.userInfo.Contact.AccountId +'/Contacts';
                  }else if(this.userlayout.userInfo.Contact.AccountId == undefined){
                    this.buttonURL='';
                  }
                else{
                  this.usermanagementError=true;
                }
             }

          }
          console.log('resultContact: ' + JSON.stringify(resultContact));
        }).catch(
            error => {
                logError(
                    {
                        lwcName:'CommunityDashButtonHomepage',
                        message:'got error: ' + JSON.stringify(error),
                        lwcFunction:'checkPermission'
                    }
                )
                if(this.isUserManagment){
                  this.buttonURL='';
                  this.usermanagementError=true;
                }
                console.error('Error getting Permission info: ' + error);
            }
            
        );
        if(this.isNewOrder){
          this.buttonText = this.userlayout.translationConfiguration.NewOrderButtonText__c.toUpperCase();
          // this.buttonURL='createrecord/NewOrder';

          this.buttonFinalStyle = 'border:none;border-radius:0.938rem; width: 100%; background-color:'+ this.buttonColor +'!important;color:'+ this.buttonTextColor + '!important';
          this.divStyle = 'white-space: nowrap; margin-bottom:0.3rem; margin-top:-1rem; margin-right:auto;margin-left:auto;border:none;text-decoration: none;font-family: OMV Source Sans Pro; font-weight: bold; font-size: 1.125rem;line-height: 50px;letter-spacing: 0.1ch;border-radius:15px; max-width: 28%; display:block;background-color:'+ this.buttonColor +'!important;color:'+ this.buttonTextColor + '!important';
        

        }

        else if (this.isCardManagment){
          this.buttonText =this.userlayout.translationConfiguration.CardManagementButtonLabel__c;
          this.buttonURL='';

          this.divStyle = 'margin-left:4.5rem;text-decoration: none; line-height: 3.125rem; border-radius: 0.938rem; width: 80%; display:block; margin-bottom:0.625rem; background-color:'+ this.buttonColor +'!important; box-shadow: 3px 4px 4px #A9A9A9';

          this.buttonFinalStyle3 = 'text-decoration: none; font-family: OMV Source Sans Pro; font-weight: bold; font-size: 18px;line-height: 3.125rem;;letter-spacing: 0.1ch;border-radius:0.938rem;text-align: center;-webkit-text-size-adjust: none; width: 100%; margin:0 auto; display:block; margin-bottom:0.625rem; background-color:'+ this.buttonColor +'!important;color:'+ this.buttonTextColor + '!important';
          
        }

        else if(this.isUserManagment){

          this.buttonText =this.userlayout.translationConfiguration.UserManagementButtonLabel__c;
          
         
         
          this.divStyle = 'margin-left:5.5rem; text-decoration: none; line-height: 3.125rem; border-radius: 0.938rem; width: 80%; display:block; margin-bottom:0.625rem; background-color:'+ this.buttonColor +'!important; box-shadow: 3px 4px 4px #A9A9A9';

          this.buttonFinalStyle3 = 'text-decoration: none; font-family: OMV Source Sans Pro; font-weight: bold; font-size: 18px;line-height: 3.125rem; letter-spacing: 0.1ch;border-radius: 0.938rem;text-align: center;-webkit-text-size-adjust: none; width: 100%; margin:0 auto; display:block;margin-bottom:0.625rem; background-color:'+ this.buttonColor +'!important;color:'+ this.buttonTextColor + '!important';
          
        }
  }
  handleModalStatus(event) {
    this.isModalOpen = false;
  }
  connectedCallback() {
   
    this.subscribeToMessageChannel();
   
  }

  openModal(){

    this.isModalOpen = true;
    this.template.querySelector('c-portal-order-creation').openModalFromButton();
  }
  errorShow(){

    const event = new ShowToastEvent({
      title: '',
      message:errorMessage,
      variant:'error'
    });
    this.dispatchEvent(event);
  }
}