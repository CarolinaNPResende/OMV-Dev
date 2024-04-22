import { LightningElement, api } from 'lwc';
import getDocumentURL from '@salesforce/apex/communityImageCardController.getDocumentURL';
import logError from '@salesforce/apex/FW_LWCLogError.logError';

export default class CommunityImageCard extends LightningElement {
    @api width;
    @api height;
    @api header;
    @api headerStyle;
    @api content;
    @api contentStyle;
    @api button;
    @api buttonURL;
    @api buttonStyle;
    @api buttonDivStyle;
    @api backgroundStyle;
    @api backgroundImage;
    @api backgroundImageURL;

    connectedCallback() {
        this.backgroundImageURL = 'https://dummy.com/xpto.png';

        getDocumentURL(
            {
                documentUniqueName: this.backgroundImage
            }
        ).then(
            result => {
                this.backgroundImageURL = result;
            }
        ).catch(
            error => {
                logError(
                    {
                        lwcName:'CommunityImageCard',
                        message:'Error getting document URL for documentUniqueName=' + this.backgroundImage,
                        lwcFunction:'getDocumentURL'
                    }
                )
                console.error('Error getting document URL for documentUniqueName=' + this.backgroundImage);
            }
        );
    }

    get cardStyle() {
        return `width: ${this.width}; height: ${this.height}; ${this.backgroundStyle}; background-image: url("${this.backgroundImageURL}")`;
    }
}