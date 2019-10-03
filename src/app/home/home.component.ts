import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService, AuthenticationService, AlertService } from '../_services';
import { Menu } from '../_models/menu';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material';



@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:variable-name
  login_ris: any;
  currentUserSubscription: Subscription;
  currentUser: User;
  users: User[] = [];
  menus: Menu[] = [];

  indexMenuSelected = 0;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private allert: AlertService,
    public dialog: MatDialog) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(data => {
      this.login_ris = data;
    });
  }

  openPlateDialog(plateSelected, idMenu, choiches ): void {
    console.log('Piatto selezionato : ' + JSON.stringify(plateSelected));

    const dialogRef = this.dialog.open(PlateDialog, {
      width: '250px',
      data: {plateSelected,choiches}
    });

    dialogRef.afterClosed().subscribe(selectedIngredients => {
      if (selectedIngredients) {
        const selIngArr = [];

        selectedIngredients.forEach(piatto => {
          selIngArr.push(piatto._text.nativeElement.outerText.trim());
          console.log(piatto._text.nativeElement.outerText.trim());
          console.log(piatto);
        });

        plateSelected.selectedIngredients = selIngArr;
        this.userService.setPlateChoice(plateSelected, idMenu, this.login_ris.data).pipe(first()).subscribe(() => {
          this.allert.success('Scelta inviata!');
        });

      }

    });
  }

  openChoicesDialog(idMenu: string): void {

    // NON PRENDERSI COSI I PARTECIPANTI MA FARE UNA GET REQUEST AL SERVER
    // usa mongo projection

    this.userService.getMyChoices(idMenu, this.login_ris.data).pipe(first()).subscribe((ris: any) => {

      const dialogRef = this.dialog.open(ChoichesDialog, {
        width: '450px',
        data: {participants : ris.data}
      });

      dialogRef.afterClosed().subscribe(selectedIngredients => {
        if (selectedIngredients) {
          const selIngArr = [];

          selectedIngredients.forEach(piatto => {
            selIngArr.push(piatto._text.nativeElement.outerText.trim());
            console.log(piatto._text.nativeElement.outerText.trim());
            console.log(piatto);
          });
        }
    });
    });

}

  ngOnInit() {
    this.getCurrentUser();

    this.loadLastMenus(1);
    //   this.loadAllUsers();
  }


  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  deleteUser(id: number) {
    this.userService.delete(id).pipe(first()).subscribe(() => {
      this.loadAllUsers();
    });
  }

  private loadAllUsers() {
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.users = users;
    });
  }

  private getCurrentUser() {
    this.userService.getByToken(this.login_ris.data).pipe(first()).subscribe((ris) => {
      this.currentUser = ris;
    });
  }

  loadLastMenus(nMenu: number) {
    this.userService.getLastMenus(nMenu, this.login_ris.data).pipe(first()).subscribe((ris: any) => {
      console.log(JSON.stringify(ris.data));
      this.menus = ris.data;
    });
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.userService.pushNewMenu(fileList, this.login_ris.data).pipe(first()).subscribe((ris: any) => {
        console.log(ris.msg);
        this.loadLastMenus(10);
      });
    }
  }

}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-choose',
  templateUrl: 'dialog-choose.html',
})
// tslint:disable-next-line:component-class-suffix
export class PlateDialog {

  constructor(
    public dialogRef: MatDialogRef<PlateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    // deselezionare il piatto precedentemente selezionato.
    this.dialogRef.close();
  }

  onSelection($event, selection): void {
  }

  precedentementeSelezionato(name): boolean {
    console.log('Bho : ' + name);
    return true;
  }
}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-chooses',
  templateUrl: 'dialog-chooses.html',
})
// tslint:disable-next-line:component-class-suffix
export class ChoichesDialog {

  constructor(
    public dialogRef: MatDialogRef<ChoichesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    // deselezionare il piatto precedentemente selezionato.
    this.dialogRef.close();
  }

  deleteChoice(indexOfChoiceToDelete): void {
    console.log(indexOfChoiceToDelete);

  }

}
