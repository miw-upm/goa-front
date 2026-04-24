import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    Input,
    OnDestroy,
    ViewChild
} from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatCard, MatCardContent, MatCardModule, MatCardTitle} from '@angular/material/card';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatCheckbox, MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogActions, MatDialogModule} from '@angular/material/dialog';
import {MatIcon, MatIconModule} from '@angular/material/icon';

import { SignerDocument } from '../SignerDocument.model';
import { CustomerService } from '../../edit-profile/customer.service';
import {SignerDocumentService} from "../signer-document.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    standalone: true,
    selector: 'app-signer-document',
    providers: [CustomerService],
    templateUrl: './signer-document.component.html',
    imports: [
        MatCardContent,
        MatCardTitle,
        MatCard,
        MatIcon,
        MatCheckbox,
        FormsModule,
        MatDialogActions,
        MatButton,
        NgOptimizedImage,
        NgIf
    ],
    styleUrls: ['./signer-document.component.scss']
})
export class SignerDocumentComponent implements AfterViewInit, OnDestroy {

    @Input() title = 'Jesús Orancoña';
    @Input() signerDocument: SignerDocument = { documentAccepted: false };
    @Input() path = 'accept-engagement-letter';

    private mobile = '';
    private token = '';
    documentDownloaded = false;

    @ViewChild('signaturePad', { static: true })
    private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

    private ctx!: CanvasRenderingContext2D;
    private drawing = false;
    private lastX = 0;
    private lastY = 0;

    isEmpty = true;

    constructor(
        private readonly signerDocumentService: SignerDocumentService,
        private readonly route: ActivatedRoute
    ) {}

    ngAfterViewInit(): void {
        this.initCanvas();
    }

    downloadDocument(): void {
        this.signerDocumentService.downloadDocument(this.path, this.mobile, this.token);
        this.documentDownloaded = true;
    }

    ngOnInit(): void {
        this.mobile = this.route.snapshot.paramMap.get('mobile') ?? '';
        this.token = this.route.snapshot.paramMap.get('token') ?? '';
    }

    ngOnDestroy(): void {
        this.ctx?.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    }

    @HostListener('window:resize')
    onResize(): void {
        const dataUrl = this.isEmpty ? null : this.canvasRef.nativeElement.toDataURL('image/png');
        this.initCanvas();
        if (dataUrl) {
            const img = new Image();
            img.onload = () => this.ctx.drawImage(img, 0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
            img.src = dataUrl;
        }
    }

    startDrawing(event: PointerEvent): void {
        event.preventDefault();
        this.drawing = true;
        const { x, y } = this.getPosition(event);
        this.lastX = x;
        this.lastY = y;
    }

    draw(event: PointerEvent): void {
        if (!this.drawing) return;
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
        this.saveSignature();
    }

    clearSignature(): void {
        const canvas = this.canvasRef.nativeElement;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.isEmpty = true;
        this.signerDocument.signature = undefined;
    }

    update(): void {
        if (!this.signerDocument.documentAccepted || this.isEmpty) return;
        this.saveSignature();
        // Aquí emitirías un @Output o llamarías al servicio correspondiente
        // this.submitted.emit(this.signerDocument);
    }

    private initCanvas(): void {
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
        const rect = this.canvasRef.nativeElement.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    private saveSignature(): void {
        if (this.isEmpty) {
            this.signerDocument.signature = undefined;
            return;
        }
        this.signerDocument.signature = this.canvasRef.nativeElement.toDataURL('image/png');
    }
}