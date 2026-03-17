import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentServicee } from '../../services/studentDashboard';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-quiz-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-player.html',
  styleUrls: ['./quiz-player.css']
})
export class QuizPlayerComponent implements OnInit {
  quizId: number = 0;
  quizData: any = null;
  isLoading = true;
  
  // Track state
  currentQuestionIndex: number = 0;
  selectedAnswers: Map<number, string> = new Map(); // QuestionID -> SelectedOption

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentServicee,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQuiz();
  }

  loadQuiz() {
    this.studentService.getQuizDetails(this.quizId).subscribe({
      next: (data: any) => {
        this.quizData = data;
        // Mocking questions for now until backend is ready
        if (!this.quizData.questions) {
          this.quizData.questions = [
            { id: 1, text: 'What is the primary purpose of a SQL JOIN?', options: ['Delete rows', 'Combine tables', 'Encrypt data', 'Backup schema'], correct: 'Combine tables' },
            { id: 2, text: 'Which tag is used for an unordered list in HTML?', options: ['<ol>', '<ul>', '<li>', '<list>'], correct: '<ul>' }
          ];
        }
        this.isLoading = false;
      },
      error: () => this.router.navigate(['/student/quizzes'])
    });
  }

  selectOption(questionId: number, option: string) {
    this.selectedAnswers.set(questionId, option);
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.quizData.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitQuiz() {
    let correctCount = 0;
    const questions = this.quizData.questions;

    questions.forEach((q: any) => {
      if (this.selectedAnswers.get(q.id) === q.correct) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    const user = this.authService.getCurrentUser();

    const submission = {
      assessmentId: this.quizId,
      studentId: user?.id,
      score: finalScore
    };

    this.studentService.submitQuiz(submission).subscribe({
      next: () => {
        alert(`Quiz Submitted! You scored ${finalScore}%`);
        this.router.navigate(['/student/quizzes']);
      }
    });
  }

  exitQuiz() {
    if (confirm("Exit quiz? Progress will be lost.")) {
      this.router.navigate(['/student/quizzes']);
    }
  }
}