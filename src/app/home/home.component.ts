import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService, AuthenticationService, AlertService } from '../_services';
import { Menu } from '../_models/menu';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList, MatChipInputEvent, MatListOption } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({ templateUrl: 'home.component.html', styleUrls: ['./home.component.scss'] })
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

  openPlateDialog(plateSelected, idMenu, selectedPlates: MatSelectionList): void {
    console.log('Piatto selezionato : ' + JSON.stringify(plateSelected));

    const dialogRef = this.dialog.open(PlateDialog, {// plateSelection
      width: '250px',
      data: { plateSelected }
    });

    dialogRef.afterClosed().subscribe(selectedIngredients => {
      if (selectedIngredients) {
        const selIngArr = [];

        selectedIngredients.forEach(piatto => {
          selIngArr.push(piatto._text.nativeElement.outerText.trim());
        });

        plateSelected.selectedIngredients = selIngArr;

        this.userService.setPlateChoice(plateSelected, idMenu, this.login_ris.data).pipe(first()).subscribe(() => {
          this.allert.success('Scelta inviata!');
        });
      } else {
        // Ha premuto cancella
        let toDeselectOption: MatListOption;

        selectedPlates.selectedOptions.selected.forEach(matOption => {
          if (matOption.value.toString().trim() === plateSelected.name.trim()) {
            toDeselectOption = matOption;
          }
        });

        selectedPlates.selectedOptions.deselect(toDeselectOption);
      }

    });
  }

  openChoicesDialog(idMenu: string): void {

    // NON PRENDERSI COSI I PARTECIPANTI MA FARE UNA GET REQUEST AL SERVER
    // usa mongo projection
    this.userService.getMyChoices(idMenu, this.login_ris.data).pipe(first()).subscribe((ris: any) => {
      // if (ris.ok)

      const dialogRef = this.dialog.open(ChoichesDialog, {
        width: '450px',
        data: { participants: ris.data, login_ris: this.login_ris, idMenu, userId: ris.userMadeRequest }
      });


      dialogRef.afterClosed().subscribe(selectedIngredients => {
        if (selectedIngredients) {
          const selIngArr = [];

          selectedIngredients.forEach(piatto => {
            selIngArr.push(piatto._text.nativeElement.outerText.trim());
          });
        }
      });
    });

  }

  ngOnInit() {
    this.getCurrentUser();

    this.loadLastMenus(10);
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
    console.log('chiuso');
    this.dialogRef.close();
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
    public userService: UserService,
    public allertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  selectedChose = -1;

  rnDeletedChoices = [];

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteChoice(indexOfPartecipantChoice, idMenu): void {

    this.userService.deleteChoiceOfMenu(indexOfPartecipantChoice, idMenu, this.data.login_ris.data)
      .pipe(first()).subscribe((ris: any) => {
        if (ris.ok) {
          this.rnDeletedChoices.push(indexOfPartecipantChoice);
          this.allertService.success(ris.msg);
        } else {
          this.allertService.error(ris.msg);
        }

      });

  }

  addIngredient(event: MatChipInputEvent, plate: any): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      plate.selectedIngredients.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  deleteIngredient(ing: string, plate: any): void {
    const index = plate.selectedIngredients.indexOf(ing.trim());

    if (index >= 0) {
      plate.selectedIngredients.splice(index, 1);

      // deleteIng
    }
  }

}

