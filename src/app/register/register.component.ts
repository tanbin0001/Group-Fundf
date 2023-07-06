import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { AuthService } from '../shared/auth.service';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  formSubmitted = false;

  email: string = '';
  password: string = '';
  name: string = '';
  constructor(
    private auth: AuthService,
    private firestore: Firestore,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);

    if (control?.hasError('required')) {
      return `${controlName} is required.`;
    }

    if (control?.hasError('email')) {
      return 'Invalid email format.';
    }
    if (control?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }

    return '';
  }

  register() {
    const name = this.registerForm.get('name')?.value ?? '';
    const email = this.registerForm.get('email')?.value ?? '';
    const password = this.registerForm.get('password')?.value ?? '';

    const userData = {
      docId: '',
      name,
      email,
    };

    const collectionInstance = collection(this.firestore, 'users');
    addDoc(collectionInstance, userData)
      .then((docRef) => {
        const docId = docRef.id;

        userData.docId = docId;

        console.log('Data saved successfully. Document ID:', docId);
        console.log(userData);

        // Update the document with the correct docId
        const docToUpdate = doc(collectionInstance, docId);
        updateDoc(docToUpdate, userData)
          .then(() => {
            console.log('Document updated successfully');
          })
          .catch((error) => {
            console.error('Error updating document:', error);
          });

        // Save user credentials and navigate to the login page
        this.auth.register(email, password);

        this.email = '';
        this.password = '';
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  }
}
