import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint } from '@features/shared/models/complaint.model';
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-complaint-form',
    standalone: true, // Esto confirma que es standalone
    imports: [
        CommonModule,         // Para usar *ngIf y *ngFor
        ReactiveFormsModule   // Para usar [formGroup] y formControlName
    ],
    templateUrl: './complaint-form.component.html',
    styleUrls: ['./complaint-form.component.scss']
})
export class ComplaintFormComponent implements OnInit {
    complaintForm: FormGroup;
    submitting = false;
    message: { type: 'success' | 'error', text: string } | null = null;

    constructor(
        private fb: FormBuilder,
        private complaintService: ComplaintService
    ) {
        // Definimos los campos que el usuario realmente rellena
        this.complaintForm = this.fb.group({
            barcode: ['', [Validators.required]], // ID Hoja de Encargo
            mobile: ['', [Validators.required]],  // ID Cliente
            description: ['', [Validators.required, Validators.minLength(15)]]
        });
    }

    ngOnInit(): void {}

    onSubmit() {
        const complaintData = this.complaintForm.value; // Your form data

        // 1. Get the token from storage
        const token = localStorage.getItem('token'); // or wherever you save it

        this.complaintService.create(complaintData, token).subscribe({
            next: (res) => {
                console.log('Success!', res);
            },
            error: (err) => {
                console.error('Error!', err);
            }
        });

    }
}