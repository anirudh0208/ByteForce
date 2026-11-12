"""
Database seeder — creates sample data for development/testing.
Run with:  uv run python -m app.utils.seed_db
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from app.database.connection import SessionLocal, create_tables
from app.database.models import User, Student, Class, Subject, Examination, Question, AnswerKey, UserRole
from app.core.security import hash_password


def seed():
    create_tables()
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).count() > 0:
            print("Database already seeded. Skipping.")
            return

        print("Seeding database...")

        # Teacher
        teacher = User(
            email="teacher@gradewise.ai",
            hashed_password=hash_password("teacher123"),
            full_name="Prof. Sarah Johnson",
            role=UserRole.teacher,
        )
        db.add(teacher)
        db.flush()

        # Class
        cls = Class(
            name="CS101 - Batch A",
            description="Introduction to Computer Science",
            teacher_id=teacher.id,
        )
        db.add(cls)
        db.flush()

        # Students (with login accounts)
        student_data = [
            ("STU001", "Alice Kumar", "alice@student.edu"),
            ("STU002", "Bob Singh", "bob@student.edu"),
            ("STU003", "Carol Patel", "carol@student.edu"),
        ]
        for sid, name, email in student_data:
            user = User(
                email=email,
                hashed_password=hash_password("student123"),
                full_name=name,
                role=UserRole.student,
            )
            db.add(user)
            db.flush()

            student = Student(
                student_id=sid,
                full_name=name,
                email=email,
                class_id=cls.id,
                user_id=user.id,
            )
            db.add(student)

        # Subject
        subject = Subject(name="Data Structures", code="CS201")
        db.add(subject)
        db.flush()

        # Exam
        exam = Examination(
            title="Mid-Semester Test — Data Structures",
            description="Topics: Arrays, Linked Lists, Stacks, Queues",
            instructions="Answer all questions. Each question carries the marks indicated.",
            subject_id=subject.id,
            class_id=cls.id,
            created_by_id=teacher.id,
            total_marks=30.0,
            is_published=True,
        )
        db.add(exam)
        db.flush()

        # Questions with answer keys
        questions_data = [
            {
                "order": 1,
                "text": "What is a linked list? Explain its advantages over arrays.",
                "max_marks": 10,
                "model_answer": "A linked list is a linear data structure where elements are stored in nodes, with each node containing data and a pointer to the next node. Advantages over arrays: (1) Dynamic size — no fixed memory allocation, (2) Efficient insertion/deletion at O(1) if pointer is known vs O(n) for arrays, (3) No memory waste from pre-allocation.",
                "rubric": [
                    {"criterion": "Definition of linked list", "marks": 3, "description": "Accurate description of node structure"},
                    {"criterion": "Dynamic size advantage", "marks": 3, "description": "Explains memory flexibility"},
                    {"criterion": "Insertion/deletion advantage", "marks": 4, "description": "Correct complexity comparison with arrays"},
                ],
            },
            {
                "order": 2,
                "text": "Explain the difference between a stack and a queue with examples.",
                "max_marks": 10,
                "model_answer": "Stack: LIFO (Last In First Out) data structure. Operations: push (add to top), pop (remove from top). Example: browser back button, function call stack. Queue: FIFO (First In First Out) data structure. Operations: enqueue (add to rear), dequeue (remove from front). Example: printer queue, OS process scheduling.",
                "rubric": [
                    {"criterion": "Stack definition and operations", "marks": 3, "description": "LIFO, push, pop explained"},
                    {"criterion": "Stack example", "marks": 2, "description": "Real-world example given"},
                    {"criterion": "Queue definition and operations", "marks": 3, "description": "FIFO, enqueue, dequeue explained"},
                    {"criterion": "Queue example", "marks": 2, "description": "Real-world example given"},
                ],
            },
            {
                "order": 3,
                "text": "What is Big-O notation? Give examples for O(1), O(n) and O(n²) operations.",
                "max_marks": 10,
                "model_answer": "Big-O notation describes the worst-case time or space complexity of an algorithm as input size n grows. O(1): constant time, e.g., accessing an array element by index. O(n): linear time, e.g., linear search through an unsorted array. O(n²): quadratic time, e.g., Bubble Sort where each element is compared to every other element.",
                "rubric": [
                    {"criterion": "Definition of Big-O", "marks": 3, "description": "Complexity and worst-case analysis"},
                    {"criterion": "O(1) with example", "marks": 2, "description": "Correct constant-time operation"},
                    {"criterion": "O(n) with example", "marks": 2, "description": "Correct linear-time operation"},
                    {"criterion": "O(n²) with example", "marks": 3, "description": "Correct quadratic example like Bubble Sort"},
                ],
            },
        ]

        for q_data in questions_data:
            q = Question(
                exam_id=exam.id,
                order=q_data["order"],
                question_text=q_data["text"],
                max_marks=q_data["max_marks"],
            )
            db.add(q)
            db.flush()

            ak = AnswerKey(
                question_id=q.id,
                model_answer=q_data["model_answer"],
                marking_rubric=q_data["rubric"],
            )
            db.add(ak)

        db.commit()
        print("✅ Seed complete!")
        print("\nTest accounts:")
        print("  Teacher: teacher@gradewise.ai / teacher123")
        print("  Student: alice@student.edu / student123 (STU001)")
        print("  Student: bob@student.edu / student123 (STU002)")
        print("  Student: carol@student.edu / student123 (STU003)")
        print(f"\nSample exam ID: {exam.id}")

    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()

