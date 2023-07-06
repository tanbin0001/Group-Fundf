// import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
// import { AuthService } from '../shared/auth.service';
// import { map } from 'rxjs/operators';

// export function validateEmailNotTaken(
//   authService: AuthService
// ): AsyncValidatorFn {
//   return (control: AbstractControl) => {
//     const email = control.value;
//     return authService.checkEmailExists(email).pipe(
//       map((emailExists) => {
//         return emailExists ? { emailTaken: true } : null;
//       })
//     );
//   };
// }
