import { Injectable, PLATFORM_ID, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { encrypt, decrypt } from "../helper-functions/encrypt-decrypt"; // Adjust path

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    setItem(key: string, value: any): void {
        if (this.isBrowser) {
            // Encrypt before saving
            const encryptedValue = encrypt(value);
            localStorage.setItem(key, encryptedValue);
        }
    }

    getItem<T>(key: string): T | null {
        if (this.isBrowser) {
            const data = localStorage.getItem(key);
            if (!data) return null;
            // Decrypt while retrieving
            return decrypt<T>(data);
        }
        return null;
    }

    removeItem(key: string): void {
        if (this.isBrowser) {
            localStorage.removeItem(key);
        }
    }

    clear(): void {
        if (this.isBrowser) {
            localStorage.clear();
        }
    }
}