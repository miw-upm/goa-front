import {Component, ViewChild, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';
import {FormsModule} from '@angular/forms';
import {DocumentAiService} from '../document-ai.service';

export interface Document {
  id: string;
  name: string;
  sizeInfo: number;
  url: string;
  uploadDate: string;
  category?: string;
}

@Component({
  standalone: true,
  selector: 'app-document-ai',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    FormsModule
  ],
  templateUrl: './document-ai.component.html',
  styleUrls: ['./document-ai.component.css']
})
export class DocumentAiComponent {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;
  
  isUploading = false;
  uploadSuccess = false;
  autoclassify = false;
  selectedFileName = '';
  selectedFile: File | null = null;
  uploadedDocument: Document | null = null;

  categories = [
    { value: 'INVOICE', label: 'Factura', icon: 'receipt' },
    { value: 'CONTRACT', label: 'Contrato', icon: 'description' },
    { value: 'JUDGMENT', label: 'Sentencia', icon: 'gavel' },
    { value: 'LEGAL_BRIEF', label: 'Escrito Legal', icon: 'article' },
    { value: 'IDENTIFICATION', label: 'Identificación', icon: 'badge' },
    { value: 'OTHER', label: 'Otro', icon: 'more_horiz' }
  ];

  constructor(private readonly documentAiService: DocumentAiService) {}

  triggerFileInput(): void {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  uploadSelectedFile(): void {
    if (this.selectedFile) {
      this.uploadFile(this.selectedFile);
      this.selectedFile = null;
    }
  }

  clearSelectedFile(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.uploadSuccess = false;
    this.autoclassify = false;
    this.uploadedDocument = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  updateCategory(category: string): void {
    if (this.uploadedDocument) {
      this.uploadedDocument.category = category;
      // Here we could call a service to save the change if needed
    }
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getCategoryLabel(value?: string): string {
    return this.categories.find(c => c.value === value)?.label || 'Sin clasificar';
  }

  getCategoryIcon(value?: string): string {
    return this.categories.find(c => c.value === value)?.icon || 'help_outline';
  }

  private uploadFile(file: File): void {
    this.isUploading = true;
    this.uploadSuccess = false;
    this.documentAiService.uploadDocument(file, this.autoclassify).subscribe({
      next: (response: Document) => {
        this.isUploading = false;
        this.uploadSuccess = true;
        this.uploadedDocument = response;
        this.autoclassify = false;
      },
      error: () => {
        this.isUploading = false;
        this.uploadSuccess = false;
        this.selectedFileName = '';
      }
    });
  }
}
