import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bootstrap-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bootstrap-form.html',
  styleUrl: './bootstrap-form.scss',
})
export class BootstrapForm {
  constructor(private router: Router) {}

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    desc: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
      alert('Form submitted successfully!');
    } else {
      this.form.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
