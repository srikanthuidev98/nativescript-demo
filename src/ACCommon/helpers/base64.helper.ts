import { File } from 'tns-core-modules/file-system';
import { isIOS } from 'tns-core-modules/ui/page';


/**
 * Convert item into base64 string.
 * @param path - Should be full path of item.
 */
export function convertToBase64String(path: string): string {
    const file: File = File.fromPath(decodeURI(path));
    const data = file.readSync();
    let base64String = '';

    if (isIOS) {
        base64String = data.base64EncodedStringWithOptions(0);
    } else {
        base64String = android.util.Base64.encodeToString(data, android.util.Base64.NO_WRAP);
    }

    return base64String;
}
