import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { map, retry } from 'rxjs/operators';
import { ConfigService } from '@app/services/config.service';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private SERVER_URL: string = 'http://localhost:8000/upload';

  constructor(
    public http$: HttpClient,
    private config: ConfigService
  ) {

      this.SERVER_URL = this.config.serverUrl;
    }

    public uploadFiles(formData: FormData, type: 'images' | 'files'){
      let url = this.SERVER_URL  + '/upload';
      let fileName = 'file';
      if (type === 'files'){
        url += `/raw/${fileName}`;
      }else{
        url += `/img/${fileName}`;
      }
    return this.http$.post<any>(url, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(retry(3));
  }

  public deleteFiles(urls){
    let cloudinary = this.config.cloudinaryId;
    let ids = urls.map(url => (
      (url.match(`^https?://res.cloudinary.com/${cloudinary}/[a-z0-9/]+/([^\.]*)\..+`) || ['d', 'dasdasdsads'])[1]
      .replace('.zip', '')
    ));

    for (let id of ids){
      this.http$.delete<any>(`${this.SERVER_URL}/files/delete/${id}/`).subscribe();
    }
  }

}
