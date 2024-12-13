import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AddTaskComponent } from '../../components/add-task/add-task.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink, AddTaskComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  tasks: any[] = [];

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks.sort((a, b) => {
          if (a.status === 'completed' && b.status !== 'completed') return 1;
          if (a.status !== 'completed' && b.status === 'completed') return -1;
          return 0;
        });
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      },
    });
  }

  onTaskAdded(): void {
    this.loadTasks();
  }

  updateTaskStatus(task: any, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    const updatedTask = {
      ...task, // Spread the existing task properties
      status: isChecked ? 'completed' : 'pending', // Toggle status based on checkbox state
    };

    this.taskService.updateTask(task.taskId, updatedTask).subscribe({
      next: () => {
        alert('Task status updated successfully!');
        this.loadTasks(); // Refresh the task list
      },
      error: (err) => {
        console.error('Error updating task:', err);
      },
    });
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        alert('Task deleted successfully!');
        this.loadTasks();
      },
      error: (err) => {
        console.error('Error deleting task:', err);
      },
    });
  }

  getTaskClass(priority: string): string {
    switch (priority) {
      case 'High':
        return 'bg-red-100 border-red-400';
      case 'Medium':
        return 'bg-yellow-100 border-yellow-400';
      case 'Low':
        return 'bg-green-100 border-green-400';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  }

  getStatusClass(status: string): string {
    return status === 'completed'
      ? 'text-green-600 font-bold'
      : 'text-gray-600';
  }

  logout() :void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
