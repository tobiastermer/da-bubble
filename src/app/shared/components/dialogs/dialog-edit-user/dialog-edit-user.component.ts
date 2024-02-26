import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { User } from '../../../models/user.class';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../firebase-services/user.service';

@Component({
  selector: 'app-dialog-edit-user',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule,
    MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, FormsModule],
  templateUrl: './dialog-edit-user.component.html',
  styleUrl: './dialog-edit-user.component.scss'
})
export class DialogEditUserComponent {

  newName: string;
  newEmail: string;
  userNameError: string = '';
  userEmailError: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    public dialog: MatDialog,
    private UserService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.newName = this.data.user.name;
    this.newEmail = this.data.user.email;
  }

  validateInputUserName() {
    this.userNameError = this.UserService.validateInputUserName(this.newName, this.data.user.name || '');
    this.cdr.detectChanges(); // Manuelle Auslösung der Änderungserkennung
  }

  validateInputUserEmail() {
    this.userEmailError = this.UserService.validateInputUserEmail(this.newEmail, this.data.user.email || '');
    this.cdr.detectChanges(); // Manuelle Auslösung der Änderungserkennung
  }

  canSaveUser(): boolean {
    return !this.userNameError && !this.userEmailError && this.newName.length > 0 && this.newEmail.length > 0;
  }

  saveUser() {
    const user = this.data.user;
    user.name = this.newName;
    user.email = this.newEmail;
    this.dialogRef.close(user);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
