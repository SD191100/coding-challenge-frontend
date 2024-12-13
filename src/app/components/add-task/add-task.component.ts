import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent {
  @Output() taskAdded = new EventEmitter<void>();
  taskForm!: FormGroup;
  // Form group for the task form
  showForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
  ) {
    // Initialize the form group
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['Medium', Validators.required], // Default priority is Medium
    });
  }

  toggleFormVisibility(): void {
    this.showForm = !this.showForm; // Toggle the form visibility
  }

  addTask(): void {
    if (this.taskForm.invalid) {
      alert('Please fill all fields.');
      return;
    }

    // Construct task object with default status
    const taskData = {
      ...this.taskForm.value,
      status: 'pending', // Default status
    };

    // Send task data to the backend
    this.taskService.addTask(taskData).subscribe({
      next: () => {
        alert('Task added successfully!');
        this.toggleFormVisibility();
        this.taskAdded.emit();
        this.router.navigate(['/']); // Redirect to home page
      },
      error: (err) => {
        console.error('Error adding task:', err);
        alert('Failed to add task. Please try again.');
      },
    });
  }
}
