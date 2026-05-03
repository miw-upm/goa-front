import {Component, ViewChild, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {DocumentAiService} from '../document-ai.service';

@Component({
  standalone: true,
  selector: 'app-document-ai',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './document-ai.component.html',
  styleUrls: ['./document-ai.component.css']
})
export class DocumentAiComponent {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;
  
  isUploading = false;
  uploadSuccess = false;
  selectedFileName = '';
  selectedFile: File | null = null;

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
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private uploadFile(file: File): void {
    this.isUploading = true;
    this.uploadSuccess = false;
    this.documentAiService.uploadDocument(file).subscribe({
      next: () => {
        this.isUploading = false;
        this.uploadSuccess = true;
      },
      error: () => {
        this.isUploading = false;
        this.uploadSuccess = false;
        this.selectedFileName = '';
      }
    });
  }
}
