import { LightningElement, api, wire, track  } from 'lwc';
import CONTACT_METHOD_FIELD from '@salesforce/schema/Contact.PreferredMethodofContact__c';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import saveSuccessMessage from '@salesforce/label/c.SaveSettingsSucess';
import saveErrorMessage from '@salesforce/label/c.SaveSettingsError';
import submitContactUpdate from '@salesforce/apex/CommunityMyContactDetailsController.submit';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CancelButton from '@salesforce/label/c.CancelButton';
import SaveButton from '@salesforce/label/c.SaveButton';
import EditButton from '@salesforce/label/c.EditButton';
export default class CommunityMyContactEdit extends LightningElement {

    label = {
        CancelButton,
        SaveButton,
        EditButton
    };

    @api contactlayoutinfo;
    @api background;
    @api contactFirstName ='';
    @api contactLastName ='';
    @api contactPhone ='';
    @api contactMobile ='';
    @api contactTitle ='';
    @api contactDepartment ='';
    @api contactMethod ='N/A';
    @api contactLinkedin ='';
    @api firstName;
    @api methodContact;
    @api lastName;
    @api title;
    @api phone;
    @api mobile;
    @api department;
    @api linkedin;
    @track isModalOpen = true;
    
    connectedCallback() {
        this.firstName  =this.contactlayoutinfo.firstContactName;
        this.lastName  =this.contactlayoutinfo.lastContactName;
        this.title  =this.contactlayoutinfo.contactTitle;
        this.methodContact  =this.contactlayoutinfo.contactPreferredMethod;
        this.phone  =this.contactlayoutinfo.contactPhone;
        this.mobile  =this.contactlayoutinfo.contactMobile;
        this.department  =this.contactlayoutinfo.contactDepartment;
        this.linkedin  =this.contactlayoutinfo.contactLinkedin;
        this.contactFirstName  =this.contactlayoutinfo.userContactInfo.Contact.FirstName;
        this.contactLastName  =this.contactlayoutinfo.userContactInfo.Contact.LastName;
        this.contactPhone  =this.contactlayoutinfo.userContactInfo.Contact.Phone;
        this.contactTitle  =this.contactlayoutinfo.userContactInfo.Contact.Title;
        this.contactMobile  =this.contactlayoutinfo.userContactInfo.Contact.MobilePhone;
        this.contactDepartment  =this.contactlayoutinfo.userContactInfo.Contact.Department;
        this.contactMethod  =this.contactlayoutinfo.userContactInfo.Contact.PreferredMethodofContact__c;
        this.contactLinkedin  =this.contactlayoutinfo.userContactInfo.Contact.LinkedInProfile__c;
    }
    @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })
    getobjectInfo(result) {
        if (result.data) {
            const rtis = result.data.recordTypeInfos;
            this.recordTypeId = Object.keys(rtis).find((rti) => rtis[rti].name === 'CEP Contact');
        }
    }
    @track methodValuesList;
    @wire(getPicklistValues, { recordTypeId:'$recordTypeId' , fieldApiName: CONTACT_METHOD_FIELD }) methodValues({data}){
        if (data) {
            this.methodValuesList = data;
        }
    }
    
    
    closeWindow() {
        // to close modal set isModalOpen tarck value as false
        this.dispatchEvent(new CustomEvent('closemodal'));
        this.isModalOpen = false;
        this.contactFirstName  =this.contactlayoutinfo.userContactInfo.Contact.FirstName;
        this.contactLastName  =this.contactlayoutinfo.userContactInfo.Contact.LastName;
        this.contactPhone  =this.contactlayoutinfo.userContactInfo.Contact.Phone;
        this.contactTitle  =this.contactlayoutinfo.userContactInfo.Contact.Title;
        this.contactMobile  =this.contactlayoutinfo.userContactInfo.Contact.MobilePhone;
        this.contactDepartment  =this.contactlayoutinfo.userContactInfo.Contact.Department;
        this.contactMethod  =this.contactlayoutinfo.userContactInfo.Contact.PreferredMethodofContact__c;
        this.contactLinkedin  =this.contactlayoutinfo.userContactInfo.Contact.LinkedInProfile__c;
    }
    
    handleSubmit(event){
        event.preventDefault();

        let updatedContact = { 'sobjectType': 'Contact' };
        updatedContact.Id = this.contactlayoutinfo.userContactInfo.Contact.Id;
        if(this.contactLastName.trim() ==='' || this.contactLastName.trim() ===null){
            throw new MyException(saveErrorMessage);
        }
        updatedContact.FirstName = this.contactFirstName;
        updatedContact.LastName = this.contactLastName;
        updatedContact.Phone = this.contactPhone;
        updatedContact.MobilePhone = this.contactMobile;
        updatedContact.Title = this.contacTitle;
        updatedContact.Department = this.contactDepartment;
        updatedContact.LinkedInProfile__c = this.contactLinkedin;
        updatedContact.PreferredMethodofContact__c = this.contactMethod;
        
        submitContactUpdate({updatedContact: updatedContact})
        .then(result => {
            const event = new ShowToastEvent({
                title: '',
                message:saveSuccessMessage,
                variant:'success'
            });
            
            this.dispatchEvent(event);
            this.isModalOpen = false;
            window.location.assign("/CEPOMVCustomerPortal/s");
        })
        .catch(error => {
            const event = new ShowToastEvent({
                title: '',
                message:saveErrorMessage,
                variant:'error'
            });
            this.dispatchEvent(event);
            this.isModalOpen = false;
            console.log(error)
        });
        
        //this.navigateToHomePage();
    }
    handleFirstNameChange(event){
        this.contactFirstName = event.target.value;
    }
    handleLastNameChange(event){
        this.contactLastName = event.target.value;
    }
    handleTitleChange(event){
        this.contacTitle = event.target.value;
    }
    handlePhoneChange(event){
        this.contactPhone = event.target.value;
    }
    handleMobileChange(event){
        this.contactMobile = event.target.value;
    }
    handleDepartmentChange(event){
        this.contactDepartment = event.target.value;
    }
    handleMethodChange(event){
        this.contactMethod = event.target.value;
    }

    handleLinkedinChange(event){
        this.contactLinkedin = event.target.value;
    }
}