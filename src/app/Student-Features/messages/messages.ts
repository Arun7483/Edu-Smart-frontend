import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-student-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrls: ['./messages.css']
})
export class MessagesComponent implements OnInit {
  
  conversations: any[] = [];
  selectedConversation: any = null;
  newMessage: string = '';
  currentUser: any = null;
  isLoading = true;

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadConversations();
    }
  }

  loadConversations() {
    this.studentService.getConversations(this.currentUser.id).subscribe({
      next: (data: any[]) => {
        this.conversations = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error("Error loading chats", err)
    });
  }

  selectChat(chat: any) {
    this.selectedConversation = chat;
    this.cdr.detectChanges();
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const msgObj = {
      senderId: this.currentUser.id,
      receiverId: this.selectedConversation.participantId,
      content: this.newMessage,
      timestamp: new Date()
    };

    // Optimistic UI update: show message immediately
    this.selectedConversation.messages.push(msgObj);
    const tempMsg = this.newMessage;
    this.newMessage = '';

    this.studentService.sendMessage(msgObj).subscribe({
      next: () => this.cdr.detectChanges(),
      error: (err: any) => {
        console.error("Message failed", err);
        this.newMessage = tempMsg; // Return text if failed
      }
    });
  }
}