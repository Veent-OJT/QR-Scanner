declare module 'html5-qrcode' {
    export class Html5QrcodeScanner {
		static FORMAT_QR_CODE: any;
        constructor(
            elementId: string,
            config: {
                fps?: number;
                qrbox?: { width: number; height: number } | number;
                aspectRatio?: number;
                disableFlip?: boolean;
                formatsToSupport?: Array<any>;
            },
            verbose?: boolean
        );
        render(onScanSuccess: (decodedText: string, decodedResult: any) => void, onScanFailure?: (error: any) => void): void;
        clear(): Promise<void>;
        stop(): Promise<void>;
    }
}