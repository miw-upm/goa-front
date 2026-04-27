import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    Output,
    ViewChild
} from '@angular/core';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogActions } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { DocumentAcceptanceResult } from './document-acceptance-result.model';

@Component({
    standalone: true,
    selector: 'app-document-acceptance',
    templateUrl: './document-acceptance.component.html',
    styleUrls: ['./document-acceptance.component.scss'],
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
        MatIcon
    ]
})
export class DocumentAcceptanceComponent implements AfterViewInit, OnDestroy {

    @Input() downloadEnabled = false;
    @Input() acceptanceEnabled = false;
    @Input() signatureEnabled = false;

    @Input() title = '';
    @Input() customerName = '';
    @Input() acceptanceLabel = 'He leído el documento y manifiesto mi conformidad con su contenido.';
    @Input() submitLabel = 'FIRMAR Y ENVIAR';
    @Input() downloadLabel = 'Descargar documento';
    @Input() downloadHint = 'Es necesario descargar y leer el documento antes de poder continuar.';
    @Input() downloadDoneLabel = 'Documento descargado correctamente';
    @Input() confirmationMessage = '';
    @Input() showCompanyInfo = true;

    @Output() downloadRequested = new EventEmitter<void>();
    @Output() submitted = new EventEmitter<DocumentAcceptanceResult>();
    @Output() completed = new EventEmitter<void>();

    documentDownloaded = false;
    completedFlag = false;
    accepted = false;
    isEmpty = true;

    @ViewChild('signaturePad', { static: false })
    private readonly canvasRef?: ElementRef<HTMLCanvasElement>;

    private ctx?: CanvasRenderingContext2D;
    private drawing = false;
    private lastX = 0;
    private lastY = 0;

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

    onDownloadClick(): void {
        this.downloadRequested.emit();
        this.documentDownloaded = true;
    }

    update(): void {
        if (!this.canSubmit()) return;
        this.submitted.emit({
            accepted: this.acceptanceEnabled ? this.accepted : undefined,
            signature: this.signatureEnabled ? this.getSignatureDataUrl() : undefined
        });
    }

    markCompleted(): void {
        this.completedFlag = true;
        this.completed.emit();
    }

    startDrawing(event: PointerEvent): void {
        if (!this.isSignatureUnlocked() || this.completedFlag) return;
        event.preventDefault();
        this.drawing = true;
        const { x, y } = this.getPosition(event);
        this.lastX = x;
        this.lastY = y;
    }

    draw(event: PointerEvent): void {
        if (!this.drawing || !this.ctx) return;
        event.preventDefault();
        const { x, y } = this.getPosition(event);

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
        this.ctx.strokeStyle = '#111';
    }

    private getPosition(event: PointerEvent): { x: number, y: number } {
        if (!this.canvasRef) return { x: 0, y: 0 };
        const rect = this.canvasRef.nativeElement.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    private getSignatureDataUrl(): string | undefined {
        if (this.isEmpty || !this.canvasRef) return undefined;
        return this.canvasRef.nativeElement.toDataURL('image/png');
    }
}
