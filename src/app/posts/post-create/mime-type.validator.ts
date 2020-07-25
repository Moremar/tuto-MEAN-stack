import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

/**
 * Validator to check if the MIME type of a file is an image
 * We cannot just use the file extension, it could easily be changed.
 * 
 * This validator is asynchronous because it needs to load the file to read its first bytes (where the MIME is encoded).
 * This validator creates and returns an observable to which Angular will register.
 * This observable instanciates a file reader and reads the file as an ArrayBuffer (binary values),
 * from which it reads the first 4 bytes containing the file MIME type.
 * 
 * The validator returns null if the validation is OK.
 */
export const mimeType = (control: AbstractControl) : Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {

    // Validation should only apply when the user actually attached a new file
    // If control.value is the URL of the file on the server, this validation does not make sense
    // This is the case when the post is edited but the image is not modified
    if (typeof(control.value) == 'string') {
        console.log('MIME type validation skipped when no new file is attached.');
        return of(null);  // Observable returning null immediately
    }

    const file = control.value as File;
    const fileReader = new FileReader();

    // create a custom Observable
    const fileReaderObs = Observable.create(
        (observer: Observer<{[key: string]: any}>) => {
            // callback when the file is loaded to check the MIME type in the first 4 bytes
            fileReader.addEventListener("loadend", () => {
                const arr = new Uint8Array(fileReader.result as ArrayBuffer);  // readAsArrayBuffer returns an ArrayBuffer
                const headerArr = arr.subarray(0, 4);
                let header = '';
                let isValid = false;
                for (let i = 0; i < headerArr.length; i++) {
                    // convert byte to hexa string
                    header += headerArr[i].toString(16);
                }
                console.log('Found file type : ' + header);
                switch(header) {
                    case "89504e47":  // png
                    case "47494638":  // gif
                    case "ffd8ffe0":  // JPEG images (JFIF, JPE, JPEG, JPG)
                    case "ffd8ffe1":  // jpg (EXIF)
                    case "ffd8ffe2":  // jpg (CANNON)
                    case "ffd8ffe3":  // jpg (SMSUNG)
                    case "ffd8ffe8":  // jpg (SPIFF)
                      isValid = true;
                      break;
                    default:
                      isValid = false;
                      break;
                }
                if (isValid) {
                    observer.next(null);
                } else {
                    observer.next({"invalidMimeType": true});
                }
                observer.complete();
            });

            // kick off the loading of the file that will call the callback when completed
            fileReader.readAsArrayBuffer(file);
        }
    );
    return fileReaderObs;
}