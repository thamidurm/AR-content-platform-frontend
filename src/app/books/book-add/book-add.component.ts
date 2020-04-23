import { Component, OnInit, ViewChild} from '@angular/core';
import { BooksService } from '@app/services/books.service';
import { AuthService } from '@app/auth/auth.service'
import { DialogService} from '@app/services/dialog.service';
// import { Book } from '@app/book';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ISBNValidator } from '@app/shared/isbn.directive';
import { FileUploadComponent } from '@app/file-upload/file-upload.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-add',
  templateUrl: './book-add.component.html',
  styleUrls: ['./book-add.component.scss']
})
export class BookAddComponent implements OnInit {

  constructor(
    private booksService: BooksService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private alert: DialogService
  ) { }

  private minFiles = 1;
  public maxFiles = 3;
  public fileError = true;
  saving = false;
  @ViewChild(FileUploadComponent)
  private fileUploadComponent: FileUploadComponent;

  public addBookForm = this.fb.group({
    title: ['', Validators.required],
    isbn: ['', [Validators.required, ISBNValidator()]],
    author: ['', Validators.required],
    publisher: [{
      value: this.authService.currentUserName,
      disabled: true
    }]
  });

  get title(){
    return this.addBookForm.get('title');
  }

  get isbn(){
    return this.addBookForm.get('isbn');
  }

  get author(){
    return this.addBookForm.get('author');
  }
  ngOnInit(): void {

  }

  onFilesChange(files){
    this.fileError = files.length < this.minFiles;
  }

  onUploadComplete(fileUrls: string[]){
   this.booksService.addBook({
        title: this.addBookForm.get('title').value,
        isbns: [this.addBookForm.get('isbn').value],
        authors: [this.addBookForm.get('author').value],
        covers: fileUrls
        }).subscribe(book=>{
          this.saving = false;
          this.alert.showSuccessAlert(
            'Book was added successfully',
            'Success');
          this.router.navigate([`books/${book.id}`]);
        }, err => {
          this.saving = false;
          this.alert.showErrorAlert(
            'An error occurred while adding book. Please refresh the page and try again.',
            'Error');
        });
  }

  onSubmit(){
    if (!this.fileError) {
      this.saving = true;
      this.fileUploadComponent.saveChanges();
    }
  }
}
