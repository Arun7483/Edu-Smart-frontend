import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { AssessmentService } from '../../services/assessment.service'; 
import { QuizBuilderService } from '../../services/quiz-builder.service';
// 🚀 1. IMPORT CHANGEDETECTORREF
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-instructor-quiz-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quizz.html',
  styleUrls: ['./quizz.css']
})
export class InstructorQuizBuilderComponent implements OnInit {
  quizForm: FormGroup;
  isSubmitted = false;
  builderMode: 'QUIZ' | 'ASSIGNMENT' = 'QUIZ'; 
  
  availableAssessments: any[] = []; 
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private assessmentService: AssessmentService,
    private quizBuilderService: QuizBuilderService,
    private cdr: ChangeDetectorRef // 🚀 2. INJECT IT HERE
  ) {
    this.quizForm = this.fb.group({
      assessmentId: ['', Validators.required],
      passingScore: [70, [Validators.required, Validators.min(1), Validators.max(100)]],
      questions: this.fb.array([]),
      assignmentPrompt: [''],
      allowFileUpload: [true]
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.currentUser.id) {
      this.loadAssessments();
    }
    this.addQuestion();
  }

  // Fetch real assessments from your database for the dropdown
  loadAssessments() {
    this.assessmentService.getAssessments(this.currentUser.id).subscribe({
      next: (data) => {
        this.availableAssessments = data;
        this.cdr.detectChanges(); // 🚀 3. WAKE ANGULAR UP! Populates dropdown instantly.
      },
      error: (err) => console.error("Failed to load assessments", err)
    });
  }

  setMode(mode: 'QUIZ' | 'ASSIGNMENT') {
    this.builderMode = mode;
  }

  get f() { return this.quizForm.controls; }
  get questions() { return this.quizForm.get('questions') as FormArray; }
  getOptions(questionIndex: number) { return this.questions.at(questionIndex).get('options') as FormArray; }

  createQuestionGroup(): FormGroup {
    return this.fb.group({
      questionText: ['', Validators.required],
      points: [10, [Validators.required, Validators.min(1)]],
      questionType: ['MULTIPLE_CHOICE', Validators.required],
      options: this.fb.array([
        this.fb.group({ optionText: ['Option A', Validators.required] }),
        this.fb.group({ optionText: ['Option B', Validators.required] })
      ]),
      correctOptionIndex: [0, Validators.required] 
    });
  }

  addQuestion() { this.questions.push(this.createQuestionGroup()); }

  removeQuestion(index: number) {
    if (this.questions.length > 1) {
      this.questions.removeAt(index);
    } else {
      alert("A quiz must have at least one question.");
    }
  }

  addOption(questionIndex: number) {
    const options = this.getOptions(questionIndex);
    if (options.length < 5) { 
      options.push(this.fb.group({ optionText: [`Option ${String.fromCharCode(65 + options.length)}`, Validators.required] }));
    }
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const options = this.getOptions(questionIndex);
    const questionGroup = this.questions.at(questionIndex) as FormGroup;
    
    if (options.length > 2) { 
      options.removeAt(optionIndex);
      if (questionGroup.get('correctOptionIndex')?.value === optionIndex) {
        questionGroup.patchValue({ correctOptionIndex: 0 });
      }
    }
  }

  setCorrectAnswer(questionIndex: number, optionIndex: number) {
    this.questions.at(questionIndex).patchValue({ correctOptionIndex: optionIndex });
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.quizForm.get('assessmentId')?.invalid || this.quizForm.get('passingScore')?.invalid) {
      alert("Please select an assessment and set a passing score.");
      return;
    }

    if (this.builderMode === 'QUIZ' && this.questions.invalid) {
      alert("Please fill out all quiz questions and options.");
      return;
    }
    
    if (this.builderMode === 'ASSIGNMENT' && !this.quizForm.get('assignmentPrompt')?.value) {
      alert("Please provide instructions for the assignment.");
      return;
    }

    const formData = this.quizForm.value;
    
    const finalPayload = {
      assessmentId: formData.assessmentId,
      passingScore: formData.passingScore,
      type: this.builderMode,
      questions: this.builderMode === 'QUIZ' ? formData.questions : [],
      assignmentPrompt: this.builderMode === 'ASSIGNMENT' ? formData.assignmentPrompt : null,
      allowFileUpload: this.builderMode === 'ASSIGNMENT' ? formData.allowFileUpload : null
    };

    this.quizBuilderService.saveQuizDetails(this.currentUser.id, finalPayload).subscribe({
      next: () => {
        alert(`${this.builderMode === 'QUIZ' ? 'Quiz' : 'Assignment'} successfully saved and linked!`);
        this.isSubmitted = false;
        this.questions.clear();
        this.addQuestion();
        this.quizForm.patchValue({ assignmentPrompt: '' });
        
        this.cdr.detectChanges(); // 🚀 4. Wakes Angular up to clear the form instantly
      },
      error: (err) => console.error("Failed to save quiz", err)
    });
  }
}