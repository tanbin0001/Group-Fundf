import { Component } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent {
  addUserForm!: FormGroup;

  name: string = '';
  email: string = '';
  password: string = '';
  constructor(
    private auth: AuthService,
    private firestore: Firestore,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.addUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  addUser() {
    if (this.addUserForm.invalid) {
      return;
    }
    const name = this.addUserForm.get('name')?.value ?? '';
    const email = this.addUserForm.get('email')?.value ?? '';

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
        this.auth.register(email, name);

        this.email = '';
        this.password = '';
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  }
}
