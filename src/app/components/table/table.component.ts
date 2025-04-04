import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { User } from '../../model/user.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {

  private apiService = inject(ApiService);
  private router = inject(Router);
  public usersList!: User[];
  public headers!: string[];
  filteredList: User[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  paginatedUsers: User[] = [];
  editingRowIndex: number = -1;
  editBackup: User | null = null;
  editingRow: any = {};
  searchInput: string = '';
  isDisabled = true;

  constructor() {
    this.usersList = [];
  }


  ngOnInit(): void {
    if(this.apiService.usersList.length === 0) {
      this.getUsersList();
    } else{
      this.usersList = this.apiService.usersList;
      this.headers = Object.keys(this.usersList[0]);
      this.headers = this.headers.filter((header) => header !== 'isEditable');
      this.totalPages = Math.ceil(this.usersList.length / this.pageSize);
      this.updatePaginatedUsers();
    }
  }

  // * API call to get the user list
  getUsersList() {
    this.apiService.getUsers().subscribe({
      next: (res) => {
        if (res.length > 0) {
          // TODO start the loader
          const updatedUserList = res.map((user:User) => ({
            ...user,
            isEditable: false}));
          this.apiService.usersList = updatedUserList;
          this.usersList = updatedUserList;
          this.headers = Object.keys(res[0]);
          this.totalPages = Math.ceil(res.length / this.pageSize);
          this.updatePaginatedUsers();
        }
      },
      error: (err) => {
        // TODO stop the loader
      },
    });
  }

  // * Pagination logic
  updatePaginatedUsers() {
    const list = this.paginatedUsers.length ? this.paginatedUsers : this.usersList;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = list.slice(start, end);
  }

  // * Next page
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedUsers();
    this.resetEdit();
  }

  // * handlle navigation to details page
  goToDetails(user: User) {
    this.apiService.currentUser = user;
    this.router.navigate(['/user', user.id]);
  }

  // * handle edit
  startEdit(index: number) {
    this.resetEdit();
    this.editingRowIndex = index;
    this.editingRow = { ...this.paginatedUsers[index] };
    this.paginatedUsers[index].isEditable = true;
  }
  
  onInputChange(key: string, event: Event) {
    const input = event.target as HTMLInputElement;
    this.editingRow[key] = input.value;
  }
  
  // * handle edit
  cancelEdit() {
    this.resetEdit()
    this.editingRowIndex = -1;
    this.editingRow = {};
  }
  
  // * handle edit
  saveEdit() {
    if (this.editingRowIndex !== null) {
      this.paginatedUsers[this.editingRowIndex] = { ...this.editingRow };
      const globalIndex = (this.currentPage - 1) * this.pageSize + this.editingRowIndex;
      this.usersList[globalIndex] = { ...this.editingRow };
      this.resetEdit();

    }
    this.cancelEdit();
  }

  get paginationArray() {
    return Array.from({ length: this.totalPages });
  }

  // * seach handler
  applySearch(term: string) {
    const lowerTerm = term.toLowerCase().trim();
  
    this.paginatedUsers = this.usersList.filter(user =>
      Object.values(user).some(value =>
        String(value).toLowerCase().includes(lowerTerm)
      )
    ); 
    this.totalPages = Math.ceil(this.paginatedUsers.length / this.pageSize);
    if(this.paginatedUsers.length == 0){
      this.currentPage = 0;
    } else{
      this.currentPage = 1;
    }
    this.updatePaginatedUsers();
  }

  // *  reset edit
  resetEdit(){
    this.usersList.forEach((user) => {
      user.isEditable = false;
    });
    this.paginatedUsers = this.usersList;
    this.updatePaginatedUsers();
  }
  
}
