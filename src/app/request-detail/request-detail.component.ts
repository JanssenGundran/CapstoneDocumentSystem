import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css']
})
export class RequestDetailComponent implements OnInit {
  requestId!: number;
  request: any;
  loading = true;
  errorMessage = '';

  backendUrl = 'http://localhost:4000'; // base URL for your backend

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.requestId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchRequestDetail();
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in!');
      throw new Error('Unauthorized');
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  fetchRequestDetail() {
  this.loading = true;
  const token = localStorage.getItem('token'); // get JWT from login

  this.http.get<any>(`${this.backendUrl}/api/document_request/${this.requestId}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe({
    next: (data) => {
      this.request = data;

      // Fix the file URL
      if (this.request?.file_path) {
        this.request.fullFileUrl = `${this.backendUrl}/${this.request.file_path}`;
      }

      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.errorMessage = 'Failed to load document request.';
      this.loading = false;
    }
  });
}

  processRequest() {
    let headers: HttpHeaders;
    try { headers = this.getAuthHeaders(); } catch { return; }

    this.http.post(`${this.backendUrl}/api/document_request/${this.requestId}/process`, {}, { headers })
      .subscribe({
        next: () => alert('Request marked as In Process'),
        error: (err) => {
          console.error(err);
          alert(err.status === 401 ? 'Unauthorized' : 'Failed to process request');
        }
      });
  }

  denyRequest() {
    let headers: HttpHeaders;
    try { headers = this.getAuthHeaders(); } catch { return; }

    this.http.post(`${this.backendUrl}/api/document_request/${this.requestId}/deny`, {}, { headers })
      .subscribe({
        next: () => alert('Request marked as Denied'),
        error: (err) => {
          console.error(err);
          alert(err.status === 401 ? 'Unauthorized' : 'Failed to deny request');
        }
      });
  }
}
