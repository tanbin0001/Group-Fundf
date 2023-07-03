import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  constructor(private auth: AuthService, private firestore: Firestore, private router: Router) {}

  // register() {
  //   if (this.name === '') {
  //     alert('Please enter name');
  //     return;
  //   } else if (this.email === '') {
  //     alert('Please enter email');
  //     return;
  //   } else if (this.password === '') {
  //     alert('Please enter password');
  //     return;
  //   }
  //   this.auth.register(this.email, this.password);
  //   const name = this.name;
  //   const email = this.email;

  //   const userData = { name, email };
  //   console.log(userData);
  //   console.log(name);
  //   const collectionInstance = collection(this.firestore, 'users');
  //   addDoc(collectionInstance, userData)
  //     .then(() => {
  //       console.log('Data saved successfully');
  //     })
  //     .catch((error) => {
  //       console.error('Error saving data:', error);
  //     });

  //   this.email = '';
  //   this.password = '';
  // }

  register() {
    if (this.name === '') {
      alert('Please enter name');
      return;
    } else if (this.email === '') {
      alert('Please enter email');
      return;
    } else if (this.password === '') {
      alert('Please enter password');
      return;
    }

    const name = this.name;
    const email = this.email;

    const userData = { name, email };
    console.log(userData);
    console.log(name);
    const collectionInstance = collection(this.firestore, 'users');
    addDoc(collectionInstance, userData)
      .then(() => {
        console.log('Data saved successfully');

        // Save user credentials and navigate to the login page
        this.auth.register(this.email, this.password);
        this.email = '';
        this.password = '';
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  }
}
