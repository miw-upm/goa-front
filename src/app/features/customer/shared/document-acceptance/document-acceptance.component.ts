import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatCard, MatCardContent, MatCardFooter, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatDialogActions} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from "@angular/material/divider";
import {ActivatedRoute} from "@angular/router";

import {FormSubmitComponent} from "@shared/ui/inputs/forms/form-submit.component";
import {SharedCustomerService} from "@features/shared/services/shared-customer.service";
import {DocumentAcceptanceResult} from './document-acceptance-result.model';

export interface DocumentAcceptanceContext {
    scope: string;
    urlId: string;
    token: string;
}

@Component({
    standalone: true,
    selector: 'app-document-acceptance',
    templateUrl: './document-acceptance.component.html',
    styleUrls: ['./document-acceptance.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        NgIf,
        NgOptimizedImage,
        FormsModule,
        MatCard,
        MatCardContent,
        MatCardTitle,
        MatButton,
        MatCheckbox,
        MatDialogActions,
        MatIcon,
        MatDivider,
        MatCardFooter,
        FormSubmitComponent,
    ]
})
export class DocumentAcceptanceComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() downloadEnabled = false;
    @Input() acceptanceEnabled = false;
    @Input() signatureEnabled = false;
    @Input() signatureDescription = '';
    @Input() downloadSuccessMessage = 'Documento descargado correctamente.';
    @Input() title = 'Aceptación de Documento';
    @Input() showCompanyInfo = true;

    @Input() successMessage = 'Su firma ha sido registrada correctamente. Le agradecemos la confianza en Ocaña Abogados.';

    @Output() downloadRequested = new EventEmitter<DocumentAcceptanceContext>();
    @Output() submitted = new EventEmitter<{ context: DocumentAcceptanceContext; result: DocumentAcceptanceResult }>();
    @Output() completed = new EventEmitter<void>();

    documentDownloaded = false;
    completedFlag = false;
    accepted = false;
    isEmpty = true;
    customerName = '';
    private context: DocumentAcceptanceContext = {scope: '', urlId: '', token: ''};

    @ViewChild('signaturePad', {static: false})
    private readonly canvasRef?: ElementRef<HTMLCanvasElement>;

    @ViewChild('submitBtn')
    private readonly submitBtn?: FormSubmitComponent;

    private ctx?: CanvasRenderingContext2D;
    private drawing = false;
    private lastX = 0;
    private lastY = 0;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly sharedCustomerService: SharedCustomerService
    ) {
    }

    ngOnInit(): void {
        this.context = {
            scope: this.route.snapshot.url[1]?.path ?? '',
            urlId: this.route.snapshot.paramMap.get('urlId') ?? '',
            token: this.route.snapshot.paramMap.get('token') ?? ''
        };
        this.sharedCustomerService.readWithToken(this.context.scope, this.context.urlId, this.context.token)
            .subscribe(user => this.customerName = user.firstName);
    }

    ngAfterViewInit(): void {
        if (this.signatureEnabled) {
            this.initCanvas();
        }
    }

    ngOnDestroy(): void {
        if (this.ctx && this.canvasRef) {
            this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
        }
    }

    @HostListener('window:resize')
    onResize(): void {
        if (!this.signatureEnabled || !this.canvasRef) return;
        const dataUrl = this.isEmpty ? null : this.canvasRef.nativeElement.toDataURL('image/png');
        this.initCanvas();
        if (dataUrl && this.ctx && this.canvasRef) {
            const img = new Image();
            const canvas = this.canvasRef.nativeElement;
            img.onload = () => this.ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
            img.src = dataUrl;
        }
    }

    onDownloadClick(downloadBtn: FormSubmitComponent): void {
        this.downloadRequested.emit(this.context);
        this.documentDownloaded = true;
        downloadBtn.markSuccess('Documento descargado correctamente.');
    }

    update(): void {
        if (!this.canSubmit()) return;
        this.submitted.emit({
            context: this.context,
            result: {
                accepted: this.acceptanceEnabled ? this.accepted : undefined,
                signature: this.signatureEnabled ? this.getSignatureDataUrl() : undefined
            }
        });
    }

    markCompleted(message = this.successMessage): void {
        this.completedFlag = true;
        this.submitBtn?.markSuccess(message);
        this.completed.emit();
    }

    markFailed(message = ''): void {
        this.submitBtn?.markError(message);
    }

    startDrawing(event: PointerEvent): void {
        if (!this.isSignatureUnlocked() || this.completedFlag) return;
        event.preventDefault();
        this.drawing = true;
        const {x, y} = this.getPosition(event);
        this.lastX = x;
        this.lastY = y;
    }

    draw(event: PointerEvent): void {
        if (!this.drawing || !this.ctx) return;
        event.preventDefault();
        const {x, y} = this.getPosition(event);

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();

        this.lastX = x;
        this.lastY = y;
        this.isEmpty = false;
    }

    stopDrawing(): void {
        if (!this.drawing) return;
        this.drawing = false;
    }

    clearSignature(): void {
        if (!this.canvasRef || !this.ctx) return;
        const canvas = this.canvasRef.nativeElement;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.isEmpty = true;
    }

    isSignatureUnlocked(): boolean {
        return !this.downloadEnabled || this.documentDownloaded;
    }

    isAcceptanceUnlocked(): boolean {
        return !this.downloadEnabled || this.documentDownloaded;
    }

    hasSubmittableContent(): boolean {
        return this.acceptanceEnabled || this.signatureEnabled;
    }

    canSubmit(): boolean {
        if (this.completedFlag) return false;
        if (this.downloadEnabled && !this.documentDownloaded) return false;
        if (this.acceptanceEnabled && !this.accepted) return false;
        if (this.signatureEnabled && this.isEmpty) return false;
        return true;
    }

    private initCanvas(): void {
        if (!this.canvasRef) return;
        const canvas = this.canvasRef.nativeElement;
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context not available');
        this.ctx = ctx;
        this.ctx.scale(dpr, dpr);
        this.ctx.lineWidth = 2.5;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = '#0b57d0';
    }

    private getPosition(event: PointerEvent): { x: number, y: number } {
        if (!this.canvasRef) return {x: 0, y: 0};
        const rect = this.canvasRef.nativeElement.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    private getSignatureDataUrl(): string | undefined {
        if (this.isEmpty || !this.canvasRef) return undefined;
        const canvas = this.canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return undefined;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const bounds = this.findSignatureBounds(imageData.data, canvas.width, canvas.height);
        if (!bounds) return undefined;

        const padding = 12;
        const left = Math.max(bounds.left - padding, 0);
        const top = Math.max(bounds.top - padding, 0);
        const right = Math.min(bounds.right + padding, canvas.width - 1);
        const bottom = Math.min(bounds.bottom + padding, canvas.height - 1);
        const width = right - left + 1;
        const height = bottom - top + 1;

        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = width;
        croppedCanvas.height = height;
        croppedCanvas.getContext('2d')?.putImageData(ctx.getImageData(left, top, width, height), 0, 0);

        return croppedCanvas.toDataURL('image/png');
    }

    private findSignatureBounds(data: Uint8ClampedArray, width: number, height: number): {
        left: number;
        top: number;
        right: number;
        bottom: number;
    } | undefined {
        let left = width;
        let top = height;
        let right = -1;
        let bottom = -1;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const alpha = data[((y * width + x) * 4) + 3];
                if (alpha === 0) continue;
                left = Math.min(left, x);
                top = Math.min(top, y);
                right = Math.max(right, x);
                bottom = Math.max(bottom, y);
            }
        }

        return right === -1 ? undefined : {left, top, right, bottom};
    }
}

