import LightningDatatable from 'lightning/datatable';
import imageColumn from './imageColumn.html';
import buttonColumn from './buttonColumn.html';
import staticbuttonColumn from './staticbuttonColumn.html';
 
export default class CustomDatatableType extends LightningDatatable {
    static customTypes = {
        imageColumn: {
            template: imageColumn,
            typeAttributes: ['imgUrl']
        },
        buttonColumn: {
            template: buttonColumn,
            typeAttributes: ['recordId', 'buttonname']
        },
        staticbuttonColumn: {
            template: staticbuttonColumn,
            typeAttributes: ['recordId', 'buttonname']
        }
    };
}