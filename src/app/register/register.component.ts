import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  constructor(private auth: AuthService, private firestore: Firestore) {}

  register() {
    if (this.email === '') {
      alert('Please enter email');
      return;
    } else if (this.password === '') {
      alert('Please enter password');
      return;
    }
    this.auth.register(this.email, this.password);
    const email = this.email;
    const password = this.password;
    const userData = { email, password };
    this.email = '';
    this.password = '';

    const collectionInstance = collection(this.firestore, 'users');
    addDoc(collectionInstance, userData);
  }
}
