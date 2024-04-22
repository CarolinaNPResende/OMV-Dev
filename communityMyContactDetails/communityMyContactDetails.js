import { LightningElement, api, wire, track  } from 'lwc';
import ResetPasswordButton from '@salesforce/label/c.ResetPasswordButton';
import EditButton from '@salesforce/label/c.EditButton';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import MOBILE_FIELD from '@salesforce/schema/Contact.MobilePhone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import ADDRESS_FIELD from '@salesforce/schema/Contact.MailingAddress';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import DEPARTMENT_FIELD from '@salesforce/schema/Contact.Department';
import LINKEDIN_FIELD from '@salesforce/schema/Contact.LinkedInProfile__c';
import CONTACT_METHOD_FIELD from '@salesforce/schema/Contact.PreferredMethodofContact__c';
import PRIVACY_POLICY_ACCEPTED_FIELD from '@salesforce/schema/User.PrivacyPolicyAccepted__c';
import PRIVACY_POLICY_DATE_FIELD from '@salesforce/schema/User.PrivacyPolicyAcceptanceDateTime__c';
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import CONTACT_ID from "@salesforce/schema/User.ContactId";
import USER_ID from "@salesforce/user/Id";
import getContactLayout from '@salesforce/apex/CommunityMyContactDetailsController.getContactInfo';
export default class CommunityMyContactDetails extends LightningElement {

    label = {
        EditButton,
        ResetPasswordButton
    };

    @wire(getRecord, { recordId: USER_ID, fields: [CONTACT_ID] })
    user;
    
    @api userId=USER_ID;
    @api contactIdToUse;
    @api contactLayout;
    get contactId() {
        this.contactIdToUse=getFieldValue(this.user.data, CONTACT_ID);
       return getFieldValue(this.user.data, CONTACT_ID);
    }
    
    get contactInfo(){
        return this.contactLayout;
    }
    // Expose a field to make it available in the template
    fields = [NAME_FIELD,PHONE_FIELD,MOBILE_FIELD,TITLE_FIELD,DEPARTMENT_FIELD,LINKEDIN_FIELD,CONTACT_METHOD_FIELD];
    readfields=[ACCOUNT_FIELD,EMAIL_FIELD,ADDRESS_FIELD];
    readuserfields=[PRIVACY_POLICY_ACCEPTED_FIELD,PRIVACY_POLICY_DATE_FIELD];

    connectedCallback() {
        getContactLayout({ }).then( resultContact => {      

                console.log('contactLayout: ' + JSON.stringify(resultContact));
                this.contactLayout = resultContact;;
            }).catch(
            error => {
                console.error('Error getting Contact info: ' + error);
            }
        );
        
    }
     //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
     @track isTabOpen = false;
     openModal() {
         // to open modal set isModalOpen tarck value as true
         this.isTabOpen = true;
     }

    @track resetPasswordComponent = false;
    resetPassword(){
        this.resetPasswordComponent = true;
    }

    closeModal(event){
        this.resetPasswordComponent = false;
        this.isTabOpen = false;
    }
}