import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private firestore: Firestore
  ) {
    this.fireAuth.authState.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  // login method
  login(email: string, password: string) {
    this.fireAuth.signInWithEmailAndPassword(email, password).then(
      () => {
        localStorage.setItem('token', 'true');
        this.isLoggedIn = true;
        this.router.navigate(['home']);
      },
      (err) => {
       
        this.router.navigate(['/login']);
      }
    );
  }

  // register method
  register(email: string, password: string) {
    this.fireAuth.createUserWithEmailAndPassword(email, password).then(
      () => {
        Swal.fire(
          'Success!',
          'Registration completed successfully.',
          'success'
        );

        this.router.navigate(['/login']);
      },
      (err) => {


        this.router.navigate(['/register']);
      }
    );
  }

  googleSignIn() {
    return this.fireAuth.signInWithPopup(new GoogleAuthProvider()).then(
      (res) => {
        console.log(res);
        const user = res.user;

        // Save user data to Firebase
        const userData = {
          name: user?.displayName,
          email: user?.email,
        };
        console.log(userData);

        const collectionInstance = collection(this.firestore, 'users');
        addDoc(collectionInstance, userData)
          .then(() => {
            console.log('Data saved successfully');
          })
          .catch((error) => {
            console.error('Error saving data:', error);
          });

        this.router.navigate(['/home']);
        localStorage.setItem('token', JSON.stringify(user?.uid));
        this.isLoggedIn = true;
      },
      (err) => {

      }
    );
  }

  // sign out
  logout() {
    this.fireAuth.signOut().then(
      () => {
        localStorage.removeItem('token');
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      },
      (err) => {

      }
    );
  }
}

