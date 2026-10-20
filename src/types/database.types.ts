// TypeScript definitions for Quiclogix Solutions Supabase Database Schema
// Matches migration 20261016000000_initial_schema_and_security.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = 'applicant' | 'student' | 'reviewer' | 'admin';
export type CohortStatus = 'draft' | 'upcoming' | 'published' | 'open' | 'active' | 'completed' | 'cancelled';
export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'withdrawn';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
export type InternshipStatus = 'scheduled' | 'active' | 'submitted' | 'under_evaluation' | 'completed' | 'withdrawn' | 'incomplete' | 'on_hold';
export type SubmissionStatus = 'draft' | 'submitted' | 'under_review' | 'revision_required' | 'approved';
export type EvaluationDecision = 'pass' | 'revision' | 'fail';
export type DocumentType = 'certificate' | 'lor';
export type DocumentStatus = 'pending' | 'approved' | 'issued' | 'revoked';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: AppRole;
          granted_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: AppRole;
          granted_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: AppRole;
          granted_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_roles_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      reviewer_assignments: {
        Row: {
          id: string;
          reviewer_id: string;
          cohort_id: string | null;
          internship_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          reviewer_id: string;
          cohort_id?: string | null;
          internship_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          reviewer_id?: string;
          cohort_id?: string | null;
          internship_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reviewer_assignments_reviewer_id_fkey';
            columns: ['reviewer_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      internship_domains: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          eligibility: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description: string;
          eligibility?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string;
          eligibility?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cohorts: {
        Row: {
          id: string;
          name: string;
          slug: string;
          domain_id: string;
          status: CohortStatus;
          application_start: string;
          application_end: string;
          start_date: string;
          end_date: string;
          capacity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          domain_id: string;
          status?: CohortStatus;
          application_start: string;
          application_end: string;
          start_date: string;
          end_date: string;
          capacity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          domain_id?: string;
          status?: CohortStatus;
          application_start?: string;
          application_end?: string;
          start_date?: string;
          end_date?: string;
          capacity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cohorts_domain_id_fkey';
            columns: ['domain_id'];
            isOneToOne: false;
            referencedRelation: 'internship_domains';
            referencedColumns: ['id'];
          }
        ];
      };
      project_briefs: {
        Row: {
          id: string;
          domain_id: string;
          title: string;
          summary: string;
          deliverables_json: Json;
          evaluation_rubric_json: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          domain_id: string;
          title: string;
          summary: string;
          deliverables_json?: Json;
          evaluation_rubric_json?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          domain_id?: string;
          title?: string;
          summary?: string;
          deliverables_json?: Json;
          evaluation_rubric_json?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          applicant_id: string;
          cohort_id: string;
          domain_id: string;
          status: ApplicationStatus;
          submitted_at: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          decision_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          applicant_id: string;
          cohort_id: string;
          domain_id: string;
          status?: ApplicationStatus;
          submitted_at?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          decision_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          applicant_id?: string;
          cohort_id?: string;
          domain_id?: string;
          status?: ApplicationStatus;
          submitted_at?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          decision_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'applications_applicant_id_fkey';
            columns: ['applicant_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'applications_cohort_id_fkey';
            columns: ['cohort_id'];
            isOneToOne: false;
            referencedRelation: 'cohorts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'applications_domain_id_fkey';
            columns: ['domain_id'];
            isOneToOne: false;
            referencedRelation: 'internship_domains';
            referencedColumns: ['id'];
          }
        ];
      };
      application_details: {
        Row: {
          id: string;
          application_id: string;
          education_or_experience: string | null;
          course_or_degree: string | null;
          branch_specialization: string | null;
          institution_name: string | null;
          study_or_graduation_year: string | null;
          phone: string | null;
          portfolio_url: string | null;
          resume_path: string | null;
          skills: string[] | null;
          consent_version: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          education_or_experience?: string | null;
          course_or_degree?: string | null;
          branch_specialization?: string | null;
          institution_name?: string | null;
          study_or_graduation_year?: string | null;
          phone?: string | null;
          portfolio_url?: string | null;
          resume_path?: string | null;
          skills?: string[] | null;
          consent_version?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          education_or_experience?: string | null;
          course_or_degree?: string | null;
          branch_specialization?: string | null;
          institution_name?: string | null;
          study_or_graduation_year?: string | null;
          phone?: string | null;
          portfolio_url?: string | null;
          resume_path?: string | null;
          skills?: string[] | null;
          consent_version?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'application_details_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: true;
            referencedRelation: 'applications';
            referencedColumns: ['id'];
          }
        ];
      };
      payments: {
        Row: {
          id: string;
          application_id: string;
          student_id: string;
          amount_cents: number;
          currency: string;
          status: PaymentStatus;
          gateway_reference: string | null;
          metadata_json: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          student_id: string;
          amount_cents: number;
          currency?: string;
          status?: PaymentStatus;
          gateway_reference?: string | null;
          metadata_json?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          student_id?: string;
          amount_cents?: number;
          currency?: string;
          status?: PaymentStatus;
          gateway_reference?: string | null;
          metadata_json?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payment_events: {
        Row: {
          id: string;
          payment_id: string;
          event_type: string;
          payload_json: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          payment_id: string;
          event_type: string;
          payload_json: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          payment_id?: string;
          event_type?: string;
          payload_json?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      internships: {
        Row: {
          id: string;
          student_id: string;
          cohort_id: string;
          domain_id: string;
          status: InternshipStatus;
          start_date: string;
          end_date: string;
          final_grade: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          cohort_id: string;
          domain_id: string;
          status?: InternshipStatus;
          start_date: string;
          end_date: string;
          final_grade?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          cohort_id?: string;
          domain_id?: string;
          status?: InternshipStatus;
          start_date?: string;
          end_date?: string;
          final_grade?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_assignments: {
        Row: {
          id: string;
          internship_id: string;
          project_brief_id: string;
          assigned_at: string;
        };
        Insert: {
          id?: string;
          internship_id: string;
          project_brief_id: string;
          assigned_at?: string;
        };
        Update: {
          id?: string;
          internship_id?: string;
          project_brief_id?: string;
          assigned_at?: string;
        };
        Relationships: [];
      };
      project_submissions: {
        Row: {
          id: string;
          project_assignment_id: string;
          student_id: string;
          github_url: string;
          live_url: string | null;
          report_path: string;
          status: SubmissionStatus;
          submitted_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_assignment_id: string;
          student_id: string;
          github_url: string;
          live_url?: string | null;
          report_path: string;
          status?: SubmissionStatus;
          submitted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_assignment_id?: string;
          student_id?: string;
          github_url?: string;
          live_url?: string | null;
          report_path?: string;
          status?: SubmissionStatus;
          submitted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      evaluations: {
        Row: {
          id: string;
          project_submission_id: string;
          reviewer_id: string;
          decision: EvaluationDecision;
          score: number | null;
          feedback_text: string | null;
          evaluation_notes: string | null;
          evaluated_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_submission_id: string;
          reviewer_id: string;
          decision: EvaluationDecision;
          score?: number | null;
          feedback_text?: string | null;
          evaluation_notes?: string | null;
          evaluated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_submission_id?: string;
          reviewer_id?: string;
          decision?: EvaluationDecision;
          score?: number | null;
          feedback_text?: string | null;
          evaluation_notes?: string | null;
          evaluated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      submission_revisions: {
        Row: {
          id: string;
          project_submission_id: string;
          revision_number: number;
          notes: string | null;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          project_submission_id: string;
          revision_number?: number;
          notes?: string | null;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          project_submission_id?: string;
          revision_number?: number;
          notes?: string | null;
          submitted_at?: string;
        };
        Relationships: [];
      };
      issued_documents: {
        Row: {
          id: string;
          student_id: string;
          internship_id: string;
          document_type: DocumentType;
          verification_id: string;
          title: string;
          file_path: string;
          status: DocumentStatus;
          issued_at: string;
          revoked_at: string | null;
          metadata_json: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          internship_id: string;
          document_type: DocumentType;
          verification_id: string;
          title: string;
          file_path: string;
          status?: DocumentStatus;
          issued_at?: string;
          revoked_at?: string | null;
          metadata_json?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          internship_id?: string;
          document_type?: DocumentType;
          verification_id?: string;
          title?: string;
          file_path?: string;
          status?: DocumentStatus;
          issued_at?: string;
          revoked_at?: string | null;
          metadata_json?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          body?: string;
          read_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata_json: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata_json?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          metadata_json?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      internship_applications: {
        Row: {
          id: string;
          reference_id: string;
          domain_id: string;
          domain_name: string;
          full_name: string;
          email: string;
          phone: string | null;
          course_or_degree: string;
          branch_specialization: string | null;
          institution_name: string;
          graduation_year: string | null;
          skills: string | null;
          portfolio_url: string | null;
          resume_path: string | null;
          status: 'submitted' | 'under_review' | 'selected' | 'not_selected';
          selection_email_status: 'pending' | 'queued' | 'sent' | 'failed';
          offer_letter_status: 'pending' | 'generated' | 'delivered' | 'failed';
          offer_letter_path: string | null;
          owner_notes: string | null;
          selected_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference_id: string;
          domain_id: string;
          domain_name: string;
          full_name: string;
          email: string;
          phone?: string | null;
          course_or_degree: string;
          branch_specialization?: string | null;
          institution_name: string;
          graduation_year?: string | null;
          skills?: string | null;
          portfolio_url?: string | null;
          resume_path?: string | null;
          status?: 'submitted' | 'under_review' | 'selected' | 'not_selected';
          selection_email_status?: 'pending' | 'queued' | 'sent' | 'failed';
          offer_letter_status?: 'pending' | 'generated' | 'delivered' | 'failed';
          offer_letter_path?: string | null;
          owner_notes?: string | null;
          selected_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reference_id?: string;
          domain_id?: string;
          domain_name?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          course_or_degree?: string;
          branch_specialization?: string | null;
          institution_name?: string;
          graduation_year?: string | null;
          skills?: string | null;
          portfolio_url?: string | null;
          resume_path?: string | null;
          status?: 'submitted' | 'under_review' | 'selected' | 'not_selected';
          selection_email_status?: 'pending' | 'queued' | 'sent' | 'failed';
          offer_letter_status?: 'pending' | 'generated' | 'delivered' | 'failed';
          offer_letter_path?: string | null;
          owner_notes?: string | null;
          selected_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "internship_applications_domain_id_fkey";
            columns: ["domain_id"];
            isOneToOne: false;
            referencedRelation: "internship_domains";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          check_user_id: string;
          check_role: AppRole;
        };
        Returns: boolean;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      submit_public_application: {
        Args: {
          p_domain_id: string;
          p_full_name: string;
          p_email: string;
          p_course_or_degree: string;
          p_institution_name: string;
          p_branch_specialization?: string | null;
          p_phone?: string | null;
          p_graduation_year?: string | null;
          p_skills?: string | null;
          p_portfolio_url?: string | null;
          p_resume_path?: string | null;
        };
        Returns: {
          success: boolean;
          is_duplicate: boolean;
          application_id: string;
          reference_id: string;
          domain_name: string;
          message: string;
        };
      };
      verify_credential: {
        Args: {
          p_verification_id: string;
        };
        Returns: {
          valid: boolean;
          verification_id: string;
          document_type: string;
          student_name: string;
          domain_name: string;
          completion_date: string;
          status: string;
          issued_at: string;
        }[];
      };
    };
    Enums: {
      app_role: AppRole;
      cohort_status: CohortStatus;
      application_status: ApplicationStatus;
      payment_status: PaymentStatus;
      internship_status: InternshipStatus;
      submission_status: SubmissionStatus;
      evaluation_decision: EvaluationDecision;
      document_type: DocumentType;
      document_status: DocumentStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
