/**
 * Mock API service for the SENGE-CE registration update form.
 * In production this would send an HTTP PATCH/PUT request to the
 * backend REST endpoint to update the member record in the database.
 */

import { FormData } from '@/types/form';
import { generateAndDownloadDocx } from './docGenerator';

/** Simulated network latency in milliseconds */
const MOCK_DELAY_MS = 1500;

/** Response shape returned by the update endpoint */
export interface ApiResponse {
  success: boolean;
  message: string;
  updatedAt?: string;
}

/**
 * Sends the registration update form data to the REST API.
 * Currently mocked: waits MOCK_DELAY_MS then returns a success response.
 *
 * @param formData - Validated form data to be sent to the server
 * @returns Promise resolving to an ApiResponse object
 */
export async function submitRegistrationUpdate(formData: FormData): Promise<ApiResponse> {
  /* Simulate async network request */
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  /*
   * Production implementation would look like:
   *
   * const response = await fetch('https://api.sengece.org.br/members/update', {
   *   method: 'PUT',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify(formData),
   * });
   * if (!response.ok) throw new Error(await response.text());
   * return response.json();
   */

  /* Log payload for development inspection */
  console.log('[MOCK API] PUT /members/update', JSON.stringify(formData, null, 2));

  // Convert to docx so the user can sign it at gob.br
  try {
    await generateAndDownloadDocx(formData);
  } catch (error) {
    console.error('[API] Error generating DOCX document:', error);
    throw new Error(
      `Failed to generate document: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  return {
    success: true,
    message: 'Cadastro atualizado com sucesso!',
    updatedAt: new Date().toISOString(),
  };
}
