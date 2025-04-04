import { Component, inject, OnInit, resolveForwardRef } from '@angular/core';
import { User } from '../../model/user.model';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-table-details',
  standalone: true,
  imports: [],
  templateUrl: './table-details.component.html',
  styleUrl: './table-details.component.css'
})
export class TableDetailsComponent implements OnInit {
  public user!: User;
  headers: string[] = [];
  private apiService = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  userId!: string;

  constructor() {
  }

  ngOnInit(): void {
    this.initializeSubscription();
    if (this.apiService.usersList.length === 0) {
      this.getUsersList();
    }
  }

  initializeSubscription() {
    this.activatedRoute.params.subscribe((params) => {
      this.userId = params['id'];
      if (this.apiService.usersList.length > 0) {
        this.user = this.apiService.usersList.find((user) => user.id === this.userId) || {} as User;
      }
    });
  }


  // * API call to get the user list
  getUsersList() {
    this.apiService.getUsers().subscribe({
      next: (res) => {
        if (res.length > 0) {
          // TODO start the loader
          const updatedUserList = res.map((user:User) => ({
            ...user,
            isEditable: false
          }));
          this.apiService.usersList = updatedUserList;
          this.user = updatedUserList.find((user) => user.id === this.userId) || {} as User;
        }
      },
      error: (err) => {
        // TODO stop the loader
      },
    });
  }


}
